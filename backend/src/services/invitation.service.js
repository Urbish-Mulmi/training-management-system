import crypto from 'crypto';
import Invitation from '../models/invitation.model.js';
import User from '../models/user.models.js';
import Batch from '../models/batch.model.js';
import Enrollment from '../models/enrollment.model.js';

import {
  sendInvitationEmail,
  sendStudentInvitationEmail,
  sendAdminInvitationEmail
} from '../utils/mailer.js';

const INVITE_EXPIRY_HOURS = 48;

// Create invitation + send email — pure logic, no req/res involved
export async function createInvitation({ userId, role, createdBy }) {
  const token = crypto.randomBytes(32).toString('hex');

  const expiresAt = new Date(
    Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000
  );

  const invitation = await Invitation.create({
    user: userId,
    role,
    createdBy,
    token,
    expiresAt,
  });

  if (role === 'instructor') {
    await sendInvitationEmail(userId, token);
  } else if (role === 'student') {
    await sendStudentInvitationEmail(userId, token);
  } else if (role === 'admin') {
    await sendAdminInvitationEmail(userId, token);
  }

  return invitation;
}

// Verify token + elevate role — pure logic, no req/res involved
export async function verifyInvitationToken(token) {
  const invitation = await Invitation.findOne({
    token,
    status: 'pending'
  });

  if (!invitation) {
    const err = new Error('Invalid or already used invitation link');
    err.statusCode = 400;
    throw err;
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await invitation.save();

    const err = new Error('This invitation has expired');
    err.statusCode = 400;
    throw err;
  }

  // 1. Elevate user role
  await User.findByIdAndUpdate(
    invitation.user,
    { role: invitation.role }
  );

  // 2. If student, finalize by pushing them into their assigned batch's student list
  if (invitation.role === 'student') {
    const enrollment = await Enrollment.findOne({
      student: invitation.user,
      enrollmentStatus: 'approved'
    });

    if (enrollment && enrollment.batch) {
      await Batch.findByIdAndUpdate(
        enrollment.batch,
        { $addToSet: { students: invitation.user } }
      );
    }
  }

  invitation.status = 'used';
  invitation.acceptedAt = new Date();

  await invitation.save();

  return invitation;
}
// import crypto from 'crypto';
// import Invitation from '../models/invitation.model.js'

// import User from '../models/user.models.js'; // adjust to match your actual User model filename
// import { sendInvitationEmail } from '../utils/mailer.js';

// const INVITE_EXPIRY_HOURS = 48;

// // Create invitation + send email — pure logic, no req/res involved
// export async function createInvitation({ userId, role, createdBy }) {
//   const token = crypto.randomBytes(32).toString('hex');
//   const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

//   const invitation = await Invitation.create({
//     user: userId,
//     role,
//     createdBy,
//     token,
//     expiresAt,
//   });

//   await sendInvitationEmail(userId, token);

//   return invitation;
// }

// // Verify token + elevate role — pure logic, no req/res involved
// export async function verifyInvitationToken(token) {
//   const invitation = await Invitation.findOne({ token, status: 'pending' });

//   if (!invitation) {
//     const err = new Error('Invalid or already used invitation link');
//     err.statusCode = 400;
//     throw err;
//   }

//   if (invitation.expiresAt < new Date()) {
//     invitation.status = 'expired';
//     await invitation.save();
//     const err = new Error('This invitation has expired');
//     err.statusCode = 400;
//     throw err;
//   }

//   await User.findByIdAndUpdate(invitation.user, { role: invitation.role });

//   invitation.status = 'used';
//   invitation.acceptedAt = new Date();
//   await invitation.save();

//   return invitation;
// }

import crypto from 'crypto';

import Invitation from '../models/invitation.model.js';

import User from '../models/user.models.js';

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

  await User.findByIdAndUpdate(
    invitation.user,
    { role: invitation.role }
  );

  invitation.status = 'used';
  invitation.acceptedAt = new Date();

  await invitation.save();

  return invitation;
}
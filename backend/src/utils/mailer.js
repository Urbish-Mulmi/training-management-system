import { Resend } from 'resend';
import User from '../models/user.models.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// for instructor onboarding:
export async function sendInvitationEmail(userId, token) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found for invitation email');

  const link = `${process.env.CLIENT_URL}/onboarding?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'TMS <onboarding@urbishbhaktamulmi.com.np>',
    to: user.email,
    subject: 'Join TMS as an Instructor',
    html: `<p>Hi ${user.fullname || ''},</p>
           <p>You've been invited to join as an instructor. Click below to activate your account:</p>
           <a href="${link}">${link}</a>
           <p>This link expires in 48 hours.</p>`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// for student onboarding:
export async function sendStudentInvitationEmail(userId, token) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found for student invitation email');

  const link = `${process.env.CLIENT_URL}/onboarding?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'TMS <onboarding@urbishbhaktamulmi.com.np>',
    to: user.email,
    subject: 'Join TMS as a Student',
    html: `<p>Hi ${user.fullname || ''},</p>
           <p>You've been invited to join the Training Management System as a student.</p>
           <p>Click below to activate your account:</p>
           <a href="${link}">${link}</a>
           <p>This link expires in 48 hours.</p>`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// for admin onboarding:
export async function sendAdminInvitationEmail(userId, token) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found for admin invitation email');

  const link = `${process.env.CLIENT_URL}/onboarding?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'TMS <onboarding@urbishbhaktamulmi.com.np>',
    to: user.email,
    subject: 'Join TMS as an Admin',
    html: `<p>Hi ${user.fullname || ''},</p>
           <p>You've been invited to join the Training Management System as an administrator.</p>
           <p>Click below to activate your account:</p>
           <a href="${link}">${link}</a>
           <p>This link expires in 48 hours.</p>`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// for contact us email:
export async function sendContactEmail(name, email, subject, message) {
  const { data, error } = await resend.emails.send({
    from: 'TMS <onboarding@urbishbhaktamulmi.com.np>',
    to: process.env.CONTACT_EMAIL,
    reply_to: email,
    subject: `Contact Inquiry: ${subject}`,
    html: `
      <h2>New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  if (error) throw new Error(error.message);

  return data;
}
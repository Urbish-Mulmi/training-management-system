import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['instructor', 'admin', 'student'],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'used', 'expired', 'revoked'],
    default: 'pending',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); // gives you createdAt + updatedAt for free

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
import { createInvitation, verifyInvitationToken } from '../services/invitation.service.js';

// POST /invite — admin triggers invitation
export const createInvitationHandler = async (req, res) => {
  try {
    const { userId, role } = req.body;

     const createdBy = req.verifyProof._id;

    const invitation = await createInvitation({ userId,role, createdBy });

    res.status(201).json({
      success: true,
      message: 'Invitation sent to email, Please check inbox/spam folder',
      data: invitation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// GET /verify — instructor clicks email link
export const verifyInvitation = async (req, res) => {
  try {
    const { token } = req.query;

    await verifyInvitationToken(token);

    res.status(200).json({
      success: true,
      message: 'Role activated',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
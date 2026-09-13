import express from 'express'
import { verifyToken,isAdmin } from '../middlewares/auth.middleware.js';
import { createInvitationHandler, verifyInvitation } from '../controllers/invitation.controller.js';


const invitationRoutes = express.Router();

invitationRoutes.post('/invite', verifyToken, isAdmin, createInvitationHandler);
invitationRoutes.get('/verify', verifyInvitation);


export default invitationRoutes;
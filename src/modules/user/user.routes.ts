import { Router } from 'express';
import { getUsersController, createUserController } from './user.controller.js';

const router = Router();

router.get('/get-user', getUsersController);
router.post('/create-user', createUserController);

export default router;

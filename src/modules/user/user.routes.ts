import { Router } from 'express';
import { getUsersController, createUserController, loginUserController, deleteUserController } from './user.controller.js';

const router = Router();

router.get('/get-user', getUsersController);
router.post('/create-user', createUserController);
router.post('/login-user', loginUserController);
router.post('/delete-user', deleteUserController);

export default router;

import { Request, Response } from 'express';
import * as userService from './user.service.js';

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users' });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    if ('message' in result) {
      return res.status(200).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

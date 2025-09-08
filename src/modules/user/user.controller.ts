import { Request, Response } from 'express';
import * as userService from './user.service.js';

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch {
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
  } catch {
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await userService.loginUser({ username, password });
    
    if ('message' in result) {
      // Return 200 with message for invalid credentials (as per API docs)
      return res.status(200).json(result);
    }
    
    // Success - return user data
    res.status(200).json(result);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }

    const result = await userService.deleteUser(uid);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

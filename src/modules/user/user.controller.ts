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
    console.log('createUserController called with body:', req.body);
    const result = await userService.createUser(req.body);
    console.log('createUser result:', result);
    if ('message' in result) {
      return res.status(200).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    console.error('createUserController error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Error creating user', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    console.log('loginUserController called with body:', req.body);
    const { username, password } = req.body;
    
    console.log('Extracted credentials:', { username: username ? 'provided' : 'missing', password: password ? 'provided' : 'missing' });
    
    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Calling userService.loginUser');
    const result = await userService.loginUser({ username, password });
    console.log('userService.loginUser result:', result);
    
    if ('message' in result) {
      // Return 200 with message for invalid credentials (as per API docs)
      console.log('Login failed with message:', result.message);
      return res.status(200).json(result);
    }
    
    // Success - return user data
    console.log('Login successful');
    res.status(200).json(result);
  } catch (error) {
    console.error('loginUserController error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
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

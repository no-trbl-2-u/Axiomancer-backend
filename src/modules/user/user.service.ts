import { UserModel } from './user.model.js';
import { User, LoginRequest, LoginResponse } from './user.types.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

export const getUsers = async (): Promise<User[]> => {
  // lean() returns a plain JS object, not a Mongoose document.
  // We also exclude the password and the mongo specific _id and __v fields
  const users = await UserModel.find({}, { password: 0, _id: 0, __v: 0 }).lean();
  return users;
};

export const createUser = async (user: User): Promise<LoginResponse | { message: string }> => {
  const existingUser = await UserModel.findOne({ $or: [{ username: user.username }, { email: user.email }] });

  if (existingUser) {
    return { message: 'Username or email already exists' };
  }

  const newUser = await UserModel.create(user);
  const { password: _, ...rest } = newUser.toObject();
  
  // Generate JWT token for the new user
  const token = jwt.sign(
    { uid: rest.uid, username: rest.username },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
  
  return { 
    uid: rest.uid, 
    username: rest.username,
    token 
  };
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse | { message: string }> => {
  try {
    // Find user by username and include password for comparison
    const user = await UserModel.findOne({ username: credentials.username }).lean();
    
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password!);
    
    if (!isPasswordValid) {
      return { message: 'Invalid credentials' };
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { uid: user.uid, username: user.username },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Return user data with token
    return {
      uid: user.uid,
      username: user.username,
      token
    };

  } catch (_error) {
    console.error('Error occurred:', _error);
    return { message: 'Login failed' };
  }
};

export const deleteUser = async (uid: string): Promise<{ message: string }> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ uid });
    
    if (!deletedUser) {
      return { message: 'User not found' };
    }

    return { message: 'User deleted successfully' };
  } catch (_error) {
    console.error('Error occurred:', _error);
    return { message: 'Failed to delete user' };
  }
};

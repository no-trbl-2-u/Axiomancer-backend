import { UserModel } from './user.model.js';
import { User } from './user.types.js';

export const getUsers = async (): Promise<User[]> => {
  // lean() returns a plain JS object, not a Mongoose document.
  // We also exclude the password and the mongo specific _id and __v fields
  const users = await UserModel.find({}, { password: 0, _id: 0, __v: 0 }).lean();
  return users;
};

export const createUser = async (user: User): Promise<Partial<User> | { message: string }> => {
  const existingUser = await UserModel.findOne({ $or: [{ username: user.username }, { email: user.email }] });

  if (existingUser) {
    return { message: 'Username or email already exists' };
  }

  const newUser = await UserModel.create(user);
  const { password, ...rest } = newUser.toObject();
  return { uid: rest.uid, username: rest.username };
};

import { Schema, model } from 'mongoose';
import { User } from './user.types.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const userSchema = new Schema<User>({
  uid: { type: String, required: true, unique: true, default: () => randomUUID() },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel = model<User>('User', userSchema);

import { model, Schema } from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt';

interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  createdAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next): Promise<void> {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  console.log('password');
  console.log(this.password);
  return await compare(password, this.password);
};

const User = model<IUser>('users', userSchema);
export { User, IUser };

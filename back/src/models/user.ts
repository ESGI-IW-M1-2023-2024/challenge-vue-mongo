import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { ITechnology, technologySchema } from './technology';
import { ILike, likeSchema } from './likes';

// TODO : add roles

interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  biography: string;
  availability: string;
  technologies: ITechnology[];
  tokens: number;
  issues: Types.ObjectId;
  comments: Types.ObjectId;
  githubLink: string;
  stackOverflowLink: string;
  likes: ILike[];
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    biography: { type: String },
    availability: { type: String },
    technologies: [technologySchema],
    tokens: { type: Number },
    issues: { type: SchemaTypes.ObjectId, ref: 'issues' },
    comments: { type: SchemaTypes.ObjectId, ref: 'comments' },
    githubLink: { type: String },
    stackOverflowLink: { type: String },
    likes: [likeSchema],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next): Promise<void> {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return await compare(password, this.password);
};

const User = model<IUser>('users', userSchema);
export { User, IUser };

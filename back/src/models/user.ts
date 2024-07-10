import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { ITechnology, technologySchema } from './technology';
import { ILike, likeSchema } from './like';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MENTOR = 'mentor',
}

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  gender: Gender;
  imageUrl: string;
  biography?: string;
  availability?: string;
  technologies?: ITechnology[];
  tokens: number;
  issues: Types.ObjectId[];
  comments?: Types.ObjectId[];
  githubLink?: string;
  stackOverflowLink?: string;
  likes: ILike[];
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: Role, default: Role.USER },
    gender: { type: String, enum: Gender, required: true },
    imageUrl: { type: String },
    biography: { type: String },
    availability: { type: String },
    technologies: [technologySchema],
    tokens: { type: Number, default: 0 },
    issues: [{ type: SchemaTypes.ObjectId, ref: 'issues' }],
    comments: [{ type: SchemaTypes.ObjectId, ref: 'comments' }],
    githubLink: { type: String, unique: true, lowercase: true, trim: true },
    stackOverflowLink: { type: String, unique: true, lowercase: true, trim: true },
    likes: [likeSchema],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next): Promise<void> {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  switch (this.gender) {
    case Gender.FEMALE:
      this.imageUrl =
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F019%2F896%2F012%2Foriginal%2Ffemale-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png&f=1&nofb=1&ipt=85baef1106b8e8b507fb5a1800e69e129aab47b284fc056f04735bc6b0ed7b06&ipo=images';
      break;
    case Gender.MALE:
      this.imageUrl =
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Favatar-icon-images%2Favatar-icon-images-4.jpg&f=1&nofb=1&ipt=a9d1c31b3b04b17c7b0f67eb7ed79d6a593ee49d1a69e3cb8f3bf6362803c2e4&ipo=images';
      break;
    case Gender.OTHER:
      this.imageUrl =
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fweb-design-and-development-2-6%2F512%2F87-1024.png&f=1&nofb=1&ipt=d4376ae27bd284bec1b1da7a711e61c7cc8aa930aabedffe74202288e4850b45&ipo=images';
      break;
  }

  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return await compare(password, this.password);
};

const User = model<IUser>('users', userSchema);
export { User, IUser };

import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { ITechnology, Technology } from './technology';
import { IMessage, Message } from './message';

enum Status {
  OPEN = 'open',
  CANCELED = 'canceled',
  BOOKED = 'booked',
  CLOSED = 'closed',
}

interface IIssue {
  idUser: Types.ObjectId;
  idMentor: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  likeScore: number;
  title: string;
  description: string;
  status: Status;
  technologies: ITechnology[];
  visioLink: string;
  bookingDate: Date;
  bookingDuration: number;
  passedDuration: number;
  messages: IMessage[];
}

const issueSchema = new Schema<IIssue>(
  {
    idUser: { type: SchemaTypes.ObjectId, ref: 'users' },
    idMentor: { type: SchemaTypes.ObjectId, ref: 'users' },
    likeScore: { type: Number },
    title: { type: String },
    description: { type: String },
    status: { type: String },
    technologies: [Technology],
    visioLink: { type: String },
    bookingDate: { type: Date },
    bookingDuration: { type: Number },
    passedDuration: { type: Number },
    messages: [Message],
  },
  { timestamps: true },
);

const Issue = model<IIssue>('issues', issueSchema);
export { Issue, IIssue };

import { model, Schema, SchemaTypes, Types } from 'mongoose';

interface IComment {
  idUser: Types.ObjectId;
  idMentor: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    idUser: { type: SchemaTypes.ObjectId, ref: 'users', required: true },
    idMentor: { type: SchemaTypes.ObjectId, ref: 'users', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Comment = model<IComment>('comments', commentSchema);
export { Comment, IComment };

import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { User } from './user';

interface IComment {
  _id: Types.ObjectId;
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

commentSchema.pre('deleteOne', async function (next) {
  const comment: IComment | null = await this.model.findOne(this.getFilter());

  if (comment) {
    await User.updateOne({ _id: comment.idMentor }, { $pull: { comments: comment._id } });
  }

  next();
});

const Comment = model<IComment>('comments', commentSchema);
export { Comment, IComment };

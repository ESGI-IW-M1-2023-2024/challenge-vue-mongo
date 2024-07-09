import { model, Schema, SchemaTypes, Types } from 'mongoose';

interface ILike {
  idUser: Types.ObjectId;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    idUser: { type: SchemaTypes.ObjectId, ref: 'users' },
    score: { type: Number, required: true },
  },
  { timestamps: true },
);

const Like = model<ILike>('likes', likeSchema);
export { Like, ILike, likeSchema };

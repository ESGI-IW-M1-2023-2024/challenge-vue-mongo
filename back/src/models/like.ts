import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { User } from './user';

interface ILike {
  _id: Types.ObjectId;
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

likeSchema.pre('deleteOne', async function (next) {
  const like: ILike | null = await this.model.findOne(this.getFilter());

  if (like) {
    await User.updateOne({ _id: like.idUser }, { $pull: { likes: like._id } });
  }

  next();
});

const Like = model<ILike>('likes', likeSchema);
export { Like, ILike, likeSchema };

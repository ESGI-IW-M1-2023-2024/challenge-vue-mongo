import { model, Schema, Types } from 'mongoose';
import { User } from './user';

interface ITechnology {
  _id: Types.ObjectId | string;
  label: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const technologySchema = new Schema<ITechnology>(
  {
    label: { type: String, required: true, lowercase: true },
  },
  { timestamps: true },
);

technologySchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await User.updateMany({ 'technologies._id': doc._id }, { $set: { 'technologies.$.label': doc.label } });
  }
});

const Technology = model<ITechnology>('technologies', technologySchema);
export { Technology, ITechnology, technologySchema };

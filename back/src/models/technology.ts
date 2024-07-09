import { model, Schema } from 'mongoose';

interface ITechnology {
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

const technologySchema = new Schema<ITechnology>(
  {
    label: { type: String, required: true },
  },
  { timestamps: true },
);

const Technology = model<ITechnology>('technologies', technologySchema);
export { Technology, ITechnology };

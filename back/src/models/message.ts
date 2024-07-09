import { model, Schema } from 'mongoose';

interface IMessage {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const messageSchema = new Schema<IMessage>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Message = model<IMessage>('messages', messageSchema);
export { Message, IMessage };

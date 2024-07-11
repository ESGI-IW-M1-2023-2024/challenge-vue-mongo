import { model, Schema, Types } from 'mongoose';

interface IMessage {
  idIssue: Types.ObjectId;
  idSender: Types.ObjectId;
  idReceiver: Types.ObjectId;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const messageSchema = new Schema<IMessage>(
  {
    idIssue: { type: Schema.Types.ObjectId, ref: 'issues' },
    idSender: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    idReceiver: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: false },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Message = model<IMessage>('messages', messageSchema);
export { Message, IMessage, messageSchema };

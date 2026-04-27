import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  channel: 'websocket' | 'rest';
  message: string;
  status: 'pending' | 'delivered' | 'failed';
  createdAt: Date;
  deliveredAt?: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  channel: { type: String, enum: ['websocket', 'rest'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  channel: { type: String, enum: ['websocket', 'rest'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date }
});

export const Notification = model('Notification', NotificationSchema);
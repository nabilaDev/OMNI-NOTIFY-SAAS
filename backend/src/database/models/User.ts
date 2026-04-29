import mongoose, { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLogin?: Date;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date 
  }
});


export const User = model<IUser>('User', UserSchema);
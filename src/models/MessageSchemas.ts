import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Message document
interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId; // Reference to the User model
  recipient: mongoose.Schema.Types.ObjectId; // Reference to the User model
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read'; // Status of the message
}

// Define the schema
const MessageSchema: Schema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
});

// Create the Message model
const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the User document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  date: Date;
 
}

// Define the schema
const UserSchema: Schema = new Schema({
 
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
 
});

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;

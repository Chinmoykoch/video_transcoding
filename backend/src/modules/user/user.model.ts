import mongoose, { Schema } from "mongoose";

export interface User {
    name: string;
    role: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date
}

const UserSchema = new Schema<User>({
   name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
  type: String,
  enum: ["user", "creator"],
  default: "user",
},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

export default mongoose.model<User>("User", UserSchema);
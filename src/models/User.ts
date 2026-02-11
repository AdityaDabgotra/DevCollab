import mongoose, { Schema } from "mongoose";

export interface User {
  username: string;
  email: string;
  password: string;
  role: string;
  bio?: string;
  techStack?: string[];
  projectsJoined?:string[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
      type: String,
      required: [true,"Username is Required"],
      trim:true,
      unique: true
  },
  email: {
      type: String,
      required: [true,"Email is Required"],
      unique: true,
      match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"Please use a valid Email address"]
  },
  password: {
      type: String,
      required: [true,"Password is Required"]
  },
  role: {
      type: String,
      required: [true,"Role is Required"],
      enum: ['user', 'admin','projectOwner']
  },
  bio: {
      type: String,
      default: ''
  },
  techStack: {
      type: [String],
      default: []
  },
  projectsJoined: {
      type: [String],
      default: []
  }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel;
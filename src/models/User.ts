import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "projectOwner";
  bio?: string;
  techStack?: string[];
  projectsJoined?: mongoose.Types.ObjectId[];
  projectsApplied?: mongoose.Types.ObjectId[];
  projectsOwned?: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please use a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    role: {
      type: String,
      enum: ["user", "projectOwner"],
      required: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    techStack: {
      type: [String],
      default: [],
    },

    projectsJoined: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        default:[]
      },
    ],
    projectsApplied: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        default:[],
      },
    ],
    projectsOwned: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        default:[],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
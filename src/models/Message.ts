import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  projectId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  senderName: string;
  content: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    senderName: {
      type: String,
      required: [true, "Sender Name is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    timestamp:{
      type:Date,
      default:Date.now()
    }
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
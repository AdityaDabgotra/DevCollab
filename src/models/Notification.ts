import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "new_message";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  projectId?: mongoose.Types.ObjectId;
  actor?: mongoose.Types.ObjectId;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },

    type: {
      type: String,
      enum: [
        "application_received",
        "application_accepted",
        "application_rejected",
        "new_message",
      ],
      required: [true, "Type is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
import mongoose from "mongoose";
import NotificationModel, { NotificationType } from "@/models/Notification";

type CreateNotificationInput = {
  recipient: string | mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  projectId?: string | mongoose.Types.ObjectId;
  actor?: string | mongoose.Types.ObjectId;
};

// Fire-and-forget style helper — call this from other routes after the
// main action has already been saved. Assumes dbConnect() was already
// called by the caller. Never throws: a failed notification should not
// break the parent request.
export async function createNotification({
  recipient,
  type,
  message,
  projectId,
  actor,
}: CreateNotificationInput) {
  try {
    await NotificationModel.create({
      recipient: new mongoose.Types.ObjectId(recipient),
      type,
      message,
      projectId: projectId ? new mongoose.Types.ObjectId(projectId) : undefined,
      actor: actor ? new mongoose.Types.ObjectId(actor) : undefined,
    });
  } catch (error) {
    console.log("Error while creating notification:", error);
  }
}
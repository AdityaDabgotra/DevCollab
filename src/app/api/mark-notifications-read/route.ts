import dbConnect from "@/lib/db";
import NotificationModel from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const { notificationId } = body;

    if (notificationId) {
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return Response.json(
          { success: false, message: "Invalid notification ID" },
          { status: 400 }
        );
      }

      await NotificationModel.updateOne(
        { _id: notificationId, recipient: session.user._id },
        { $set: { read: true } }
      );
    } else {
      await NotificationModel.updateMany(
        { recipient: session.user._id, read: false },
        { $set: { read: true } }
      );
    }

    return Response.json(
      { success: true, message: "Notifications updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while marking notifications read:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
import dbConnect from "@/lib/db";
import NotificationModel from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const notifications = await NotificationModel.find({
      recipient: session.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await NotificationModel.countDocuments({
      recipient: session.user._id,
      read: false,
    });

    return Response.json(
      {
        success: true,
        message: "Notifications fetched",
        data: { notifications, unreadCount },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching notifications:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
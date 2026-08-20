import dbConnect from "@/lib/db";
import MessageModel from "@/models/Message";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { projectId } = await req.json();

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return Response.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const userId = session.user._id.toString();
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members?.some((id) => id.toString() === userId);

    if (!isOwner && !isMember) {
      return Response.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const messages = await MessageModel.find({ projectId }).sort({
      timestamp: 1,
    });

    return Response.json(
      { success: true, message: "Messages fetched", data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching messages:", error);
    return Response.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

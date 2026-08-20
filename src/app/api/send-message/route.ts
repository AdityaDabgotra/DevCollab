import MessageModel from "@/models/Message";
import ProjectModel from "@/models/Project";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id || !session.user.username) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const { projectId, content } = body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return Response.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const trimmed = typeof content === "string" ? content.trim() : "";
    if (!trimmed) {
      return Response.json(
        { success: false, message: "Message content is required" },
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

    await MessageModel.create({
      projectId: new mongoose.Types.ObjectId(projectId),
      sender: new mongoose.Types.ObjectId(userId),
      senderName: session.user.username,
      content: trimmed,
      timestamp: new Date(),
    });

    return Response.json(
      { success: true, message: "message stored" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while storing message", error);
    return Response.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

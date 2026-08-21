import dbConnect from "@/lib/db";
import CommentModel from "@/models/Comment";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { createNotification } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id || !session.user.username) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
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
        { success: false, message: "Comment content is required" },
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

    const comment = await CommentModel.create({
      projectId: new mongoose.Types.ObjectId(projectId),
      author: new mongoose.Types.ObjectId(userId),
      authorName: session.user.username,
      content: trimmed,
    });

    if (project.owner.toString() !== userId) {
      await createNotification({
        recipient: project.owner,
        type: "new_comment",
        message: `${session.user.username} commented on "${project.title}"`,
        projectId: project._id as mongoose.Types.ObjectId,
        actor: userId,
      });
    }

    return Response.json(
      { success: true, message: "Comment posted", data: comment },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while posting comment:", error);
    return Response.json(
      { success: false, message: "Failed to post comment" },
      { status: 500 }
    );
  }
}
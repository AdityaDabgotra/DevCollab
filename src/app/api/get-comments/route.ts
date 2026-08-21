import dbConnect from "@/lib/db";
import CommentModel from "@/models/Comment";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { projectId } = await request.json();

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return Response.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const comments = await CommentModel.find({ projectId }).sort({
      createdAt: 1,
    });

    return Response.json(
      { success: true, message: "Comments fetched", data: comments },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching comments:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
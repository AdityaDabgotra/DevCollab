import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return Response.json(
        { success: false, message: "Invalid projectId" },
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

    const userId = session.user._id;

    if (project.applicants.some(id => id.toString() === userId)) {
      return Response.json(
        { success: false, message: "Already applied" },
        { status: 400 }
      );
    }

    project.applicants = project.applicants.filter(Boolean);

    project.applicants.push(new mongoose.Types.ObjectId(userId));

    await project.save();

    return Response.json(
      { success: true, message: "Successfully applied" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while applying for project:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
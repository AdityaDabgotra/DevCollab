import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";

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

    const userId = session.user._id;

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    if (project.applicants.includes(userObjectId)) {
      return Response.json(
        { success: false, message: "Already applied" },
        { status: 400 }
      );
    }

    project.applicants.push(userObjectId);
    user.projectsApplied = user.projectsApplied || [];
    user.projectsApplied.push(projectObjectId);

    await project.save();
    await user.save();

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
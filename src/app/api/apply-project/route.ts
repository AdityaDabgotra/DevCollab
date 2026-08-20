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

    if (session.user.role !== "user") {
      return Response.json(
        { success: false, message: "Only developers can apply to projects" },
        { status: 403 }
      );
    }

    const { projectId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return Response.json(
        { success: false, message: "Invalid projectId" },
        { status: 400 }
      );
    }

    const userId = session.user._id.toString();

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.status !== "open") {
      return Response.json(
        { success: false, message: "Project is closed" },
        { status: 400 }
      );
    }

    if (project.owner.toString() === userId) {
      return Response.json(
        { success: false, message: "Owners cannot apply to their own project" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const alreadyApplied = project.applicants?.some(
      (id) => id.toString() === userId
    );
    const alreadyMember = project.members?.some(
      (id) => id.toString() === userId
    );

    if (alreadyApplied || alreadyMember) {
      return Response.json(
        { success: false, message: alreadyMember ? "Already a member" : "Already applied" },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

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

import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    const { projectId, applicantId } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();

    const user = await UserModel.findById(applicantId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }
    if (project.owner.toString() !== session.user._id) {
      return Response.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const idx = user.projectsApplied.findIndex(
      (id) => id.toString() === projectId
    );

    if (idx !== undefined && idx !== -1) {
      user.projectsApplied.splice(idx, 1);
    }

    if (
      !user.projectsJoined?.some((id) => id.toString() === projectId)
    ) {
      user.projectsJoined?.push(new mongoose.Types.ObjectId(projectId));
    }

    const idx2 = project.applicants?.findIndex(
      (id) => id.toString() === applicantId
    );

    if (idx2 !== undefined && idx2 !== -1) {
      project.applicants.splice(idx2, 1);
    }

    if (
      !project.members?.some((id) => id.toString() === applicantId)
    ) {
      project.members.push(new mongoose.Types.ObjectId(applicantId));
    }

    await user.save();
    await project.save();

    return Response.json(
      { success: true, message: "User Accepted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while accepting user ", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

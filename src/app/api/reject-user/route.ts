import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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

    const { projectId, applicantId } = await request.json();

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

    const user = await UserModel.findById(applicantId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const appliedIdx = user.projectsApplied.findIndex(
      (id) => id.toString() === projectId
    );

    if (appliedIdx !== -1) {
      user.projectsApplied.splice(appliedIdx, 1);
    }

    const applicantIdx = project.applicants.findIndex(
      (id) => id.toString() === applicantId
    );

    if (applicantIdx !== -1) {
      project.applicants.splice(applicantIdx, 1);
    }

    await user.save();
    await project.save();

    return Response.json(
      { success: true, message: "User rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while rejecting user ", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
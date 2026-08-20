import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId, status } = await req.json();

    if (!["open", "closed"].includes(status)) {
      return Response.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const project = await ProjectModel.findById(projectId).select("owner");
    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner.toString() !== session.user._id.toString()) {
      return Response.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await ProjectModel.findByIdAndUpdate(projectId, { status });

    return Response.json({ success: true });
  } catch (error) {
    console.log("Status change error", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

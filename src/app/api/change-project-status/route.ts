import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "projectOwner") {
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

import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
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

    const { title, description, techStack, status } = await request.json();

    const project = await ProjectModel.create({
      title,
      description,
      techStack,
      status,
      owner: session.user._id,
    });

    return Response.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return Response.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}
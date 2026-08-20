import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
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

    if (session.user.role !== "projectOwner") {
      return Response.json(
        { success: false, message: "Only project owners can create projects" },
        { status: 403 }
      );
    }

    const user = await UserModel.findById(session.user._id);

    if(!user){
      return Response.json(
        { success: false, message: "User Not found" },
        { status: 401 }
      );
    }

    const { title, description, techStack, status } = await request.json();

    if (!title || !description) {
      return Response.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    const project = await ProjectModel.create({
      title,
      description,
      techStack: Array.isArray(techStack)
        ? techStack.map((t: string) => String(t).trim()).filter(Boolean)
        : [],
      status: status === "closed" ? "closed" : "open",
      owner: session.user._id,
    });

    user.projectsOwned = user.projectsOwned || [];
    user.projectsOwned.push(project._id);
    await user.save();

    return Response.json(
      { success: true, message: "Project created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return Response.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}

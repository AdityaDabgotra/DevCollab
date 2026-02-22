import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
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

    const { title, description, techStack, status } = await request.json();

    const project = await ProjectModel.create({
      title,
      description,
      techStack,
      status,
      owner: session.user._id,
    });

    const user = await UserModel.findOne({_id:session.user._id});

    if(!user){
      return Response.json(
        { success: false, message: "User Not found" },
        { status: 401 }
      );
    }
    user.projectsOwned?.push(project._id);
    console.log(user.projectsOwned);
    
    await user.save()

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
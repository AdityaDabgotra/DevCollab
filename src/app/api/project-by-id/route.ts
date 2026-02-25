import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const projectId  = await request.json();

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId.id)) {
      return Response.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await ProjectModel.findById(projectId.id)
      .populate("owner", "username email role")
      .lean();
      
    if (!project) {
      return Response.json(
        { success: false, message: "Project doesn't exist" },
        { status: 404 }
      );
    }

    const applicantsData = await UserModel.find({
      _id: { $in: project.applicants || [] },
    })
      .select("username email bio techStack role")
      .lean();
      

    return Response.json(
      {
        success: true,
        message: "Project fetched successfully",
        data: {
          _id: project._id,
          title: project.title,
          description: project.description,
          techStack: project.techStack,
          status: project.status,
          owner: project.owner,
          applicants: applicantsData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching project by id", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
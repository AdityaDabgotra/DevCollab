import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";

export async function GET(request: Request) {
  try {
    dbConnect();
    const projects = await ProjectModel.find()
      .populate("owner") // full owner object
      .populate("applicants") // full applicants
      .populate("members");

    if (!projects) {
      return Response.json(
        {
          success: false,
          message: "Cant fetch projects",
        },
        { status: 500 }
      );
    }
    console.log(projects);
    
    return Response.json({
        success:true,
        message:"Data Fetched Successfully",
        data:projects
    })
  } catch (error) {}
}

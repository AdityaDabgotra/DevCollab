import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import ProjectModel from "@/models/Project";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const user = await UserModel.findOne({
      username: session.user.username,
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }


    const appliedProjects = await ProjectModel.find({
      _id: { $in: user.projectsApplied || [] },
    }).populate("owner", "username");

    const joinedProjects = await ProjectModel.find({
      _id: { $in: user.projectsJoined || [] },
    }).populate("owner", "username");
    
    return Response.json(
      {
        success: true,
        message:"Data fetched successfully",
        data: {
          appliedProjects,
          joinedProjects,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while fetching user project data: ", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
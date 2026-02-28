import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
ProjectModel;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(
            { success: false, message: "Not Authenticated" },
            { status: 402 }
          );
    }
    await dbConnect();
    const { username } = await request.json();

    const user = await UserModel.findOne({ username })
      .select("-password")
      .populate("projectsJoined", "title techStack status")
      .populate("projectsOwned", "title techStack status");

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching user profile", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
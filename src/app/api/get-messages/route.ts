import dbConnect from "@/lib/db";
import MessageModel from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = getServerSession(authOptions);
    if(!session){
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { projectId } = await req.json();
    if(!projectId){
        return Response.json({ success: false, message: "Project ID is required" }, { status: 400 });
    }
    await dbConnect();

    const messages = await MessageModel.find({ projectId }).sort({
      timestamp: 1,
    });

    return Response.json({ success: true, message:"Messages fetched",data:messages }, { status: 200 });
  } catch (error) {
    console.log("Error fetching messages:", error);
    return Response.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}

import MessageModel from "@/models/Message";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body = await req.json();
    const { projectId,sender,sender_name, content,timestamp } = body;
    
    const message = await MessageModel.create({
        projectId:new mongoose.Types.ObjectId(projectId),
        sender: new mongoose.Types.ObjectId(sender),
        senderName: sender_name,
        content,
        timestamp
    });

    return Response.json({ success: true, message:"message stored" },{status:200});
  } catch (error) {
    console.log("error while storing message", error);
    return Response.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}

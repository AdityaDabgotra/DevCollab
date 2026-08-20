import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();
    const session = await getServerSession(authOptions);
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/a07eb546-430e-4283-a5ad-88fd71cceafa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"initial",hypothesisId:"H4",location:"update-password/route.ts:11",message:"Password update request context",data:{username,sessionUsername:session?.user?.username,hasCurrentPassword:Boolean(currentPassword),hasNewPassword:Boolean(newPassword)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if(!session || session.user.username !== username) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Please log in.",
        },
        { status: 401 }
      );
    }
    

    if (!newPassword) {
      return Response.json(
        {
          success: false,
          message: "New password is required.",
        },
        { status: 400 }
      );
    }
    await dbConnect();

    const user = await UserModel.findOne({ username }).select("+password");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/a07eb546-430e-4283-a5ad-88fd71cceafa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"initial",hypothesisId:"H4",location:"update-password/route.ts:50",message:"Password compare result",data:{isPasswordCorrect},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        { status: 400 }
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Password updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update password. Please try again.",
      },
      { status: 500 }
    );
  }
}

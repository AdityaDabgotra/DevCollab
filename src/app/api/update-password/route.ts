import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();
    const session = await getServerSession(authOptions);
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

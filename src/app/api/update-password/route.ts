import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const { username, newPassword } = await request.json();
    if (!newPassword) {
      return Response.json(
        {
          success: false,
          message: "New password is required.",
        },
        { status: 400 }
      )
    }
    await dbConnect();

    const user = await UserModel.findOne({username});
    if(!user){
        return Response.json(
            {
              success: false,
              message: "User not found.",
            },
            { status: 404 }
        )
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return Response.json(
        {
            success: true,
            message: "Password updated successfully!",
        },
        { status: 200 }
    )
  } catch (error) {
    console.error("Error updating password:", error);
    return Response.json(
        {
            success: false,
            message: "Failed to update password. Please try again.",
        },
        { status: 500 }
    )
  }
}

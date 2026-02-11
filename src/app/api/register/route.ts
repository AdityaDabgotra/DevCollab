import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/schemas/RegisterSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const parsedData = registerSchema.parse(body);

    const { username, email, password, role } = parsedData;

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return Response.json(
      { success: true, message: "User Registered Successfully." },
      { status: 201 }
    );
  } catch (error: any) {

    if (error.code === 11000) {
      return Response.json(
        { success: false, message: "Username or Email already exists" },
        { status: 400 }
      );
    }

    console.error("Error in signUp route:", error);

    return Response.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
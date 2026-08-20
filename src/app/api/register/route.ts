import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/schemas/RegisterSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/a07eb546-430e-4283-a5ad-88fd71cceafa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"initial",hypothesisId:"H3",location:"register/route.ts:11",message:"Register request received",data:{username:body?.username,email:body?.email,role:body?.role},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    let parsedData;
    try {
      parsedData = registerSchema.parse(body);
    } catch (validationError: any) {
      return Response.json(
        { success: false, message: "Validation Error" },
        { status: 400 }
      );
    }

    const { username, email, password, role } = parsedData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/a07eb546-430e-4283-a5ad-88fd71cceafa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"initial",hypothesisId:"H3",location:"register/route.ts:30",message:"Register existing user check",data:{exists:Boolean(existingUser)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username or Email already exists",
        },
        { status: 200 }
      );
    }

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return Response.json(
      { success: true, message: "User Registered Successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in signUp route:", error);

    return Response.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}

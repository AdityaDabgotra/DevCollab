import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { bio, techStack } = await request.json();

        const user = await UserModel.findOne({ username: session.user.username });
        if(!user){
            return Response.json({ success: false, message: "User not found." },
            { status: 404 }
            );
        }
        user.bio = typeof bio === "string" ? bio : user.bio;
        user.techStack = Array.isArray(techStack)
            ? techStack.map((t: string) => String(t).trim()).filter(Boolean)
            : user.techStack;
        await user.save();

        return Response.json({ success: true, message: "Profile updated successfully!" },
        { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile:", error);
        return Response.json({ 
            success: false, 
            message: "Failed to update profile. Please try again." },
            { status: 500 }
        );}
}

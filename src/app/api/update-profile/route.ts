import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, bio, techStack } = await request.json();

        const user = await UserModel.findOne({ username });
        if(!user){
            return Response.json({ success: false, message: "User not found." },
            { status: 404 }
            );
        }
        user.bio = bio;
        user.techStack = techStack;
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
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    
    try {
        await dbConnect();
        const { username } = await request.json();
        const User = username.trim();
        const user = await UserModel.findOne({username: User});
        
        if (user) {
            return Response.json({ 
                success: false,
                message: "Username is already taken." 
            }, { status: 200 });
        } else {
            return Response.json({ 
                success: true,
                message: "Username is available." 
            }, { status: 200 });
        }
    } catch (error) {
        return Response.json({ 
            success: false,
            message: "An error occurred while checking username uniqueness." 
        }, { status: 500 });
    }
}
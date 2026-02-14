import dbConnect from "@/lib/db";
import UserModel from "@/models/User";


export async function POST(request: Request) {
    try {
        dbConnect()
        const {username} = await request.json()
        const user = await UserModel.findOne({username})
        if(!user) {
            return Response.json({
                success: false,
                message: 'User not found',
            })
        }

        return Response.json({
            success: true,
            message: 'Profile data fetched successfully',
            data: {
                bio: user.bio,
                techStack: user.techStack,
                projectsJoined: user.projectsJoined
            }
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to fetch profile data',
        })
    }
}
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
ProjectModel;

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }

        await dbConnect();
        const user = await UserModel.findOne({ username: session.user.username })
            .populate("projectsJoined", "title")
            .populate("projectsOwned", "title");

        if(!user) {
            return Response.json({
                success: false,
                message: 'User not found',
            }, { status: 404 })
        }

        const joinedTitles = (user.projectsJoined || [])
            .map((project: any) => project?.title)
            .filter(Boolean);

        return Response.json({
            success: true,
            message: 'Profile data fetched successfully',
            data: {
                bio: user.bio,
                techStack: user.techStack,
                projectsJoined: joinedTitles
            }
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to fetch profile data',
        }, { status: 500 })
    }
}

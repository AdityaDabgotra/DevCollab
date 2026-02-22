import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import ProjectModel from "@/models/Project";

export async function GET(request:Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if(!session){
            return Response.json(
                {success:false,message:"Not authenticated"},
                {status:400}
            )
        }
        const user = await UserModel.findById({_id:session?.user?._id});
        if(!user){
            return Response.json(
                {success:false,message:"User Not found"},
                {status:400}
            )
        }

        const ownerProjects = await ProjectModel.find({
            _id: { $in: user.projectsOwned || [] },
          }).populate("owner", "username");

        return Response.json(
            {success:true,message:"User's owned project fetched successfully",data:ownerProjects},
            {status:200}
        )
    } catch (error) {
        console.log("Error while fetching owner projects");
        return Response.json(
            {success:false,message:error},
            {status:500}
        )
    }
}
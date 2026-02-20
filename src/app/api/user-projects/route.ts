import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function GET(request:Request){
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if(!session){
            return Response.json(
                {success:false,message:"Not Authenticated"},
                {status:500},
            )
        }
        const id = session.user._id
        const user = await UserModel.findOne({_id:id});
        if(!user){
            return Response.json(
                {success:false,message:"user not found"},
                {status:400}
            )
        }
        const projectsApplied = user.projectsApplied;
        return Response.json(
            {success:true,message:"User Projects applied fetched",data:projectsApplied},
            {status:200}
        )
    } catch (error) {
        console.log("Error while fetching user applied project",error);
        return Response.json(
            {success:false,message:error},
            {status:400}
        )
        
    }
}
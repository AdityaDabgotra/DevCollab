import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import mongoose from "mongoose";

export async function POST(request:Request) {
    try {
        await dbConnect();
        const projectId = await request.json();
        if(!projectId){
            return Response.json(
                {success:false,message:"Didn't get the project Id"},
                {status:400}
            )
        }
        const project = await ProjectModel.findById(new mongoose.Types.ObjectId(projectId));
        if(!project){
            return Response.json(
                {success:false,message:"Project Don't exist"},
                {status:400}
            )
        }
        
        return Response.json(
            {success:true,message:"Project fetched successfully",data:project},
            {status:200}
        )
    } catch (error) {
        console.log("Error while fetching project by id",error);
        return Response.json(
            {success:false,message:error},
            {status:500}
        )
        
    }
}
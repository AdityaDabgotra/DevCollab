import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/a07eb546-430e-4283-a5ad-88fd71cceafa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"initial",hypothesisId:"H1",location:"change-project-status/route.ts:10",message:"Status change auth check",data:{hasSession:Boolean(session),sessionUserId:session?.user?._id,sessionRole:session?.user?.role},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!session || session.user.role !== "projectOwner") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId, status } = await req.json();
    const projectBefore = await ProjectModel.findById(projectId).select("owner status");
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/a07eb546-430e-4283-a5ad-88fd71cceafa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"initial",hypothesisId:"H1",location:"change-project-status/route.ts:23",message:"Status change target project ownership",data:{projectId,status,targetOwner:projectBefore?.owner?.toString?.(),actingUserId:session?.user?._id},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!["open", "closed"].includes(status)) {
      return Response.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await ProjectModel.findByIdAndUpdate(projectId, { status });

    return Response.json({ success: true });
  } catch (error) {
    console.log("Status change error", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

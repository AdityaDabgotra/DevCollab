"use client";
import { useSession } from "next-auth/react";

const page = () => {
    const { data: session } = useSession();
  return (
    <div>
      dashboard for {session?.user?.username}
    </div>
  )
}

export default page

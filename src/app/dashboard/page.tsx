"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardProjectSection from "@/components/DashboardProjectSection";
import DashboardProjectSection2 from "@/components/DashboardProjectSection2";

type Project = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  owner: { username: string };
  status: "open" | "closed";
};

const DashboardPage = () => {
  const { data: session, status } = useSession();

  const [appliedProjects, setAppliedProjects] = useState<Project[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<Project[]>([]);
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const role = session?.user?.role;
  const username = session?.user?.username;

  const fetchUserDashboard = async () => {
    try {
      const res = await axios.get("/api/get-user-projects");

      setAppliedProjects(res.data.data.appliedProjects || []);
      setJoinedProjects(res.data.data.joinedProjects || []);
    } catch (error) {
      console.error("Error fetching user projects", error);
    }
  };

  const fetchOwnerProjects = async () => {
    try {
      const res = await axios.get("/api/owner-projects");
      
      setCreatedProjects(res.data.data || []);
    } catch (error) {
      console.error("Error fetching owner projects", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    if (status === "authenticated") {
      const load = async () => {
        if(role === "user"){
          await fetchUserDashboard();
        }

        if (role === "projectOwner") {
          await fetchOwnerProjects();
        }
        setLoading(false);
      };

      load();
    }
  }, [status, role]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-signal">
        Warming the desk...
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">Your floor</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">
          Welcome back,
          <br />
          <span className="text-ember">{username}</span>
        </h1>
        <div className="hairline mt-6 mb-10" />

        {/* USER ROLE */}
        {role === "user" && (
          <>
            <DashboardProjectSection
              title="Applied Projects"
              projects={appliedProjects}
              emptyMessage="You haven't applied to any projects yet."
            />

            <DashboardProjectSection2
              title="Joined Projects"
              projects={joinedProjects}
              emptyMessage="You are not part of any project yet."
            />
          </>
        )}

        {/* PROJECT OWNER ROLE */}
        {role === "projectOwner" && (
          <DashboardProjectSection2
            title="Your Created Projects"
            projects={createdProjects}
            emptyMessage="You haven't created any projects yet."
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

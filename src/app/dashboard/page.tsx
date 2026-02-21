"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardProjectSection from "@/components/DashboardProjectSection";

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
      setCreatedProjects(res.data.projects || []);
    } catch (error) {
      console.error("Error fetching owner projects", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      const load = async () => {
        await fetchUserDashboard();

        if (role === "projectOwner") {
          await fetchOwnerProjects();
        }

        setLoading(false);
      };

      load();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#7747ff]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ff] px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e0e4b] leading-tight">
          Welcome back,<span className="text-[#7747ff]">{username}</span>
        </h1>

        <div className="w-88 h-1 bg-[#7747ff] rounded-full mt-4 mb-8"></div>

        {/* USER ROLE */}
        {role === "user" && (
          <>
            <DashboardProjectSection
              title="Applied Projects"
              projects={appliedProjects}
              emptyMessage="You haven't applied to any projects yet."
            />

            <DashboardProjectSection
              title="Joined Projects"
              projects={joinedProjects}
              emptyMessage="You are not part of any project yet."
            />
          </>
        )}

        {/* PROJECT OWNER ROLE */}
        {role === "projectOwner" && (
          <DashboardProjectSection
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

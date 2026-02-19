"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  owner: {
    username: string;
  };
  status: "open" | "closed";
};

const SeeProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects");
      setProjects(res.data.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ff] px-6 py-10">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-[#1e0e4b]">
          Explore Projects 🚀
        </h1>
        <p className="text-zinc-500 mt-2">
          Find exciting collaborations and apply to work with amazing devs.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-[#7747ff] font-medium">
          Loading projects...
        </p>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <p className="text-center text-zinc-500">
          No projects available right now.
        </p>
      )}

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={project._id}
            id={project._id as any}
            index={index + 1}
            title={project.title}
            desc={project.description}
            techStack={project.techStack}
            owner={project.owner?.username || "Unknown"}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
};

export default SeeProjectsPage;
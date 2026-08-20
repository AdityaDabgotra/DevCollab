"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "@/components/ProjectCard";
import mongoose from "mongoose";

type Project = {
  _id: mongoose.Types.ObjectId;
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
  const [userProjects, setUserProjects] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, userProjectsRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/user-projects"),
        ]);

        setProjects(projectsRes.data.data);
        setUserProjects(userProjectsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto mb-10 max-w-7xl">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">Open benches</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">
          Explore <span className="text-ember">projects</span>
        </h1>
        <p className="mt-3 max-w-xl text-fog">
          Find a stack match and apply. Closed rooms stay closed.
        </p>
      </div>

      {loading && (
        <p className="text-center font-medium text-signal">Loading projects...</p>
      )}

      {!loading && projects.length === 0 && (
        <p className="text-center text-fog">No projects on the floor right now.</p>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project, index) => {
          const alreadyApplied = userProjects.some(
            (userProjectId) => userProjectId === project._id.toString()
          );

          return (
            <ProjectCard
              key={project._id.toString()}
              id={project._id}
              index={index + 1}
              title={project.title}
              desc={project.description}
              techStack={project.techStack}
              owner={project.owner?.username || "Unknown"}
              status={project.status}
              alreadyApplied={alreadyApplied}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SeeProjectsPage;

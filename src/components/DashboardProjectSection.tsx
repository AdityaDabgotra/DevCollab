"use client";

import ProjectCard from "@/components/ProjectCard";

type Project = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  owner: { username: string };
  status: "open" | "closed";
};

type Props = {
  title: string;
  projects: Project[];
  emptyMessage: string;
};

const DashboardProjectSection = ({ title, projects, emptyMessage }: Props) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#1e0e4b] mb-4">{title}</h2>

      {projects.length === 0 ? (
        <p className="text-zinc-500">{emptyMessage}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
              alreadyApplied={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardProjectSection;
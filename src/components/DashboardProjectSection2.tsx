"use client";

import ProjectCard2 from "@/components/ProjectCard2";

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

const DashboardProjectSection2 = ({ title, projects, emptyMessage }: Props) => {
  return (
    <div className="mb-12">
      <h2 className="display mb-6 text-3xl text-paper">{title}</h2>

      {projects.length === 0 ? (
        <p className="text-fog">{emptyMessage}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project, index) => (
            <ProjectCard2
              key={index}
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
      )}
    </div>
  );
};

export default DashboardProjectSection2;
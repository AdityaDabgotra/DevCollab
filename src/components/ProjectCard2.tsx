"use client";

import mongoose from "mongoose";
import Link from "next/link";

type ProjectCardProps = {
  id: mongoose.Types.ObjectId;
  index: number;
  title: string;
  desc: string;
  techStack?: string[];
  owner: string;
  status?: "open" | "closed";
};

const ProjectCard2 = ({
  id,
  index,
  title,
  desc,
  owner,
  techStack,
}: ProjectCardProps) => {
  return (
    <div className="cut-frame relative flex min-h-80 flex-col justify-between p-6">
      <span className="display absolute right-3 top-2 text-5xl text-signal/25">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <p className="text-xs tracking-[0.25em] text-ember uppercase">{owner}</p>
        <h1 className="display mt-3 pr-10 text-2xl text-paper">{title}</h1>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-fog">{desc}</p>
        {techStack && techStack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {techStack.slice(0, 5).map((tech, i) => (
              <span key={i} className="chip">
                {tech}
              </span>
            ))}
            {techStack.length > 5 && (
              <span className="text-xs text-fog">+{techStack.length - 5}</span>
            )}
          </div>
        )}
      </div>

      <Link
        href={`/projects/${id}`}
        className="cut-btn mt-6 block bg-signal py-2 text-center text-sm font-medium text-ink"
      >
        Open room
      </Link>
    </div>
  );
};

export default ProjectCard2;

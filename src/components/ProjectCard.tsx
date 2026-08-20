"use client";

import axios from "axios";
import mongoose from "mongoose";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type ProjectCardProps = {
  id: mongoose.Types.ObjectId;
  index: number;
  title: string;
  desc: string;
  techStack?: string[];
  owner: string;
  status?: "open" | "closed";
  alreadyApplied: boolean;
};

const ProjectCard = ({
  id,
  index,
  title,
  desc,
  owner,
  techStack,
  status = "open",
  alreadyApplied,
}: ProjectCardProps) => {
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApplied(alreadyApplied);
  }, [alreadyApplied]);

  const handleApply = async () => {
    if (status !== "open" || applied) return;

    try {
      setLoading(true);

      const response = await axios.post("/api/apply-project", {
        projectId: id,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      setApplied(true);
      toast.success(`Applied to project ${title}`);
    } catch (error) {
      toast.error("Failed to apply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isClosed = status !== "open";

  return (
    <div className="cut-frame relative flex min-h-80 flex-col justify-between p-6">
      <span className="display absolute right-3 top-2 text-5xl text-ember/30">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <p className="text-xs tracking-[0.25em] text-signal uppercase">{owner}</p>
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

      <button
        onClick={handleApply}
        disabled={loading || applied || isClosed}
        className={`cut-btn mt-6 w-full py-2 text-sm font-medium ${
          isClosed
            ? "border border-line text-fog"
            : applied
              ? "bg-signal/20 text-signal"
              : "bg-ember text-ink"
        }`}
      >
        {isClosed ? "Closed" : loading ? "Applying..." : applied ? "Applied" : "Apply"}
      </button>
    </div>
  );
};

export default ProjectCard;

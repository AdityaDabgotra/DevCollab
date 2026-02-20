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
    <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-6 space-y-3 relative overflow-hidden rounded-xl hover:scale-102 transition-transform duration-300 flex flex-col justify-between">
      <div>
        <div className="w-24 h-24 bg-[#7747ff] rounded-full absolute -right-5 -top-7 flex items-end justify-start">
          <p className="mb-5 ml-6 text-white text-2xl font-bold">{index}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="fill-[#7747ff] w-10">
            <svg viewBox="0 0 24 24">
              <path d="m24,6.928v13.072h-11.5v3h5v1H6.5v-1h5v-3H0V4.5c0-1.379,1.122-2.5,2.5-2.5h12.98c-.253.295-.54.631-.856,1H2.5c-.827,0-1.5.673-1.5,1.5v14.5h22v-10.993l1-1.079Zm-12.749,3.094C19.058.891,19.093.855,19.11.838c1.118-1.115,2.936-1.113,4.052.002,1.114,1.117,1.114,2.936,0,4.052l-8.185,8.828c-.116,1.826-1.623,3.281-3.478,3.281h-5.59l.097-.582c.043-.257,1.086-6.16,5.244-6.396Zm2.749,3.478c0-1.379-1.122-2.5-2.5-2.5-2.834,0-4.018,3.569-4.378,5h4.378c1.378,0,2.5-1.121,2.5-2.5Zm.814-1.073l2.066-2.229c-.332-1.186-1.371-2.057-2.606-2.172-.641.749-1.261,1.475-1.817,2.125,1.117.321,1.998,1.176,2.357,2.277Zm.208-5.276c1.162.313,2.125,1.134,2.617,2.229l4.803-5.18c.737-.741.737-1.925.012-2.653-.724-.725-1.908-.727-2.637,0-.069.08-2.435,2.846-4.795,5.606Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#7747ff]">{owner}</p>
        </div>

        <h1 className="font-bold text-xl text-[#1e0e4b]">{title}</h1>

        <p className="text-[13px] text-zinc-500 leading-6 line-clamp-3">
          {desc}
        </p>

        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {techStack.slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className="text-xs bg-[#f3f0ff] text-[#7747ff] px-2 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 5 && (
              <span className="text-xs text-zinc-400">
                +{techStack.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleApply}
        disabled={loading || applied || isClosed}
        className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-all duration-300
          ${
            isClosed
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : applied
              ? "bg-green-100 text-green-600 cursor-not-allowed"
              : "bg-[#7747ff] text-white hover:bg-[#5f37d6]"
          }`}
      >
        {isClosed
          ? "Closed"
          : loading
          ? "Applying..."
          : applied
          ? "Applied"
          : "Apply"}
      </button>
    </div>
  );
};

export default ProjectCard;

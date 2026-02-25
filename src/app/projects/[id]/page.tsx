"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Applicant = {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  techStack?: string[];
  role?: string;
};

type ProjectOwner = {
  _id?: string;
  username: string;
  email?: string;
  role?: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  owner: ProjectOwner | null;
};

const Page = () => {
  const params = useParams<{ id?: string | string[] }>();
  const id = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] ?? "" : raw;
  }, [params]);

  const [showApplicants, setShowApplicants] = useState(false);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [project, setProject] = useState<Project>({
    id: "",
    title: "",
    description: "",
    techStack: [],
    status: "",
    owner: null,
  });

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await axios.post("/api/project-by-id", { id });
        if (!response.data.success) {
          return;
        }

        const data = response.data.data;

        setApplicants(data.applicants || []);
        setProject({
          id: data._id,
          title: data.title || "",
          description: data.description || "",
          techStack: data.techStack || [],
          status: data.status || "",
          owner: data.owner || null,
        });
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    };

    fetchProject();
  }, [id]);

  const isOwner = true;

  return (
    <div className="bg-[#f7f5ff] flex min-h-screen">
      {/* LEFT CONTENT */}
      <div className="flex-1 px-8 py-10">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-[#1e0e4b]">
          Project <span className="text-[#7747ff]">#{project.id}</span>
        </h1>

        <div className="w-40 h-1 bg-[#7747ff] rounded-full mt-4 mb-8" />

        {/* Project Info Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-[#1e0e4b]">
            {project.title}
          </h2>

          <p className="text-zinc-600">
           {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-[#f3f0ff] text-[#7747ff] px-2 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          <p className="text-sm text-zinc-500">
            Owner:{" "}
            <span className="text-[#7747ff] font-semibold">
              {project.owner?.username ?? "Unknown"}
            </span>
          </p>

          <p className="text-sm text-zinc-500">
            Status: <span className="font-semibold">{project.status || "N/A"}</span>
          </p>

          {/* Owner Controls */}
          {isOwner && (
            <button
              onClick={() => setShowApplicants(true)}
              className="mt-4 px-4 py-2 bg-[#7747ff] text-white rounded-lg hover:bg-[#5f37d6] transition"
            >
              View Applicants
            </button>
          )}
        </div>

        {/* APPLICANTS DRAWER */}
        {showApplicants && (
          <div className="mt-8 bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1e0e4b]">Applicants</h3>
              <button
                onClick={() => setShowApplicants(false)}
                className="text-sm text-zinc-500 hover:text-red-500"
              >
                Close
              </button>
            </div>

            {applicants.length === 0 ? (
              <p className="text-zinc-500">No applicants yet.</p>
            ) : (
              <div className="space-y-3">
                {applicants.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-[#7747ff] font-semibold">
                        {applicant.username}
                      </p>

                      <div className="flex gap-2 mt-1 flex-wrap">
                        {applicant.techStack?.map((tech) => (
                              <span
                            key={tech}
                            className="text-xs bg-[#f3f0ff] text-[#7747ff] px-2 py-1 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-md hover:bg-green-200">
                        Accept
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT CHAT PANEL */}
      <div className="w-95 bg-white flex flex-col max-h-133 sticky top-0">
        {/* Chat Header */}
        <div className="p-4">
          <h3 className="font-bold text-[#1e0e4b]">Project Chat </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 scroll-smooth message"></div>

        {/* Input */}
        <div className="p-4 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
            />
            <button className="bg-[#7747ff] text-white px-4 rounded-lg hover:bg-[#5f37d6]">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;


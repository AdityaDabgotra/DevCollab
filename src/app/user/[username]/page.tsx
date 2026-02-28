"use client";

import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";

type Project = {
  _id: string;
  title: string;
  techStack: string[];
  status: string;
};

type User = {
  username: string;
  bio?: string;
  role: string;
  techStack?: string[];
  projectsJoined?: Project[];
  projectsOwned?: Project[];
};

const Page = () => {
  const params = useParams<{ username?: string | string[] }>();

  const username = useMemo(() => {
    const raw = params?.username;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] ?? "" : raw;
  }, [params]);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.post("/api/user-by-username", { username });
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.log("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [username]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#7747ff]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ff] px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-3xl font-extrabold text-[#1e0e4b]">
            {user.username}
          </h1>
          <p className="text-sm text-[#7747ff] font-semibold mt-1">
            {user.role}
          </p>

          {user.bio && (
            <p className="text-zinc-600 mt-3">{user.bio}</p>
          )}

          {/* TECH STACK */}
          <div className="flex flex-wrap gap-2 mt-4">
            {user.techStack?.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-[#f3f0ff] text-[#7747ff] px-2 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* JOINED PROJECTS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-[#1e0e4b] mb-4">
            Joined Projects
          </h2>

          {user.projectsJoined?.length === 0 ? (
            <p className="text-zinc-500">No joined projects</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {user.projectsJoined?.map((project) => (
                <div
                  key={project._id}
                  className="border rounded-xl p-4 hover:shadow transition"
                >
                  <p className="font-semibold text-[#1e0e4b]">
                    {project.title}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-[#f3f0ff] text-[#7747ff] px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-zinc-500 mt-2">
                    {project.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OWNED PROJECTS */}
        {user.role === "projectOwner" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-[#1e0e4b] mb-4">
              Owned Projects
            </h2>

            {user.projectsOwned?.length === 0 ? (
              <p className="text-zinc-500">No owned projects</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {user.projectsOwned?.map((project) => (
                  <div
                    key={project._id}
                    className="border rounded-xl p-4 hover:shadow transition"
                  >
                    <p className="font-semibold text-[#1e0e4b]">
                      {project.title}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-[#f3f0ff] text-[#7747ff] px-2 py-1 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-500 mt-2">
                      {project.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
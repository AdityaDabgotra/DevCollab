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
      <div className="flex min-h-[70vh] items-center justify-center text-signal">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="cut-frame p-6">
          <p className="text-xs tracking-[0.3em] text-signal uppercase">
            {user.role}
          </p>
          <h1 className="display mt-2 text-5xl">{user.username}</h1>
          {user.bio && <p className="mt-4 max-w-2xl text-fog">{user.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {user.techStack?.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="cut-frame p-6">
          <h2 className="display text-3xl">Joined rooms</h2>
          {user.projectsJoined?.length === 0 ? (
            <p className="mt-3 text-fog">No joined projects</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {user.projectsJoined?.map((project) => (
                <div key={project._id} className="border border-line p-4">
                  <p className="display text-xl text-paper">{project.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-fog">
                    {project.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {user.role === "projectOwner" && (
          <div className="cut-frame p-6">
            <h2 className="display text-3xl">Owned rooms</h2>
            {user.projectsOwned?.length === 0 ? (
              <p className="mt-3 text-fog">No owned projects</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {user.projectsOwned?.map((project) => (
                  <div key={project._id} className="border border-line p-4">
                    <p className="display text-xl text-paper">{project.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-fog">
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
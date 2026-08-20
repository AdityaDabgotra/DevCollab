"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const { data: session, status } = useSession();

  const [bio, setBio] = useState("");
  const [techStack, setTechStack] = useState("");
  const [projects, setProjects] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.username) return;

    const fetchProfileData = async () => {
      try {
        const response = await axios.post("/api/get-profile", {
          username: session.user.username,
        });

        if (!response.data.success) return;

        const data = response.data.data;

        setBio(data.bio || "");
        setTechStack((data.techStack || []).join(", "));
        setProjects((data.projectsJoined || []).join(", "));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, [session, status]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/update-profile", {
        username: session?.user.username,
        bio,
        techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
      });
      if (!response.data.success) {
        toast.error("Failed to update profile. Please try again.");
        return;
      }
      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading")
    return <p className="mt-10 text-center text-fog">Loading...</p>;

  return (
    <div className="flex min-h-[88vh] items-center justify-center px-4 py-10">
      <div className="cut-frame w-full max-w-xl p-8">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">Badge</p>
        <h1 className="display mt-2 text-4xl">
          Your <span className="text-ember">profile</span>
        </h1>

        <div className="mt-6 flex items-start justify-between gap-4 text-sm">
          <div>
            <p className="text-fog">
              Username{" "}
              <span className="text-paper">{session?.user.username}</span>
            </p>
            <p className="mt-1 text-fog">
              Email <span className="text-paper">{session?.user.email}</span>
            </p>
          </div>
          <Link href="/change-password" className="text-ember text-sm">
            Change password
          </Link>
        </div>

        <div className="mt-8 space-y-4 text-sm">
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="field"
              placeholder="Tell the room who you are..."
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Tech stack
            </label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="field"
              placeholder="Add the tools you actually use"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Rooms joined
            </label>
            <p className="field text-fog">
              {projects === "" ? "Nothing yet. Apply to a bench." : projects}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cut-btn w-full bg-ember py-3 font-medium text-ink disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

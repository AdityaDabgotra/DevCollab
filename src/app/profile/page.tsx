"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
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
        username : session?.user.username,
        bio,
        techStack: techStack.split(",").map((t) => t.trim()),
        projectsJoined: projects.split(",").map((p) => p.trim()),
      });
      if(!response.data.success) {
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
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 -mt-8.25 -mb-5">
      <div className="w-full h-[97%] max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#7747ff] mb-6">
          DevCollab Profile
        </h1>

        {/* USER INFO */}
        <div className="mb-6 space-y-2 text-sm">
          <p className="p-2 rounded-lg transition hover:bg-[#7747ff]/10 hover:text-[#7747ff] cursor-pointer">
            <span className="font-semibold">Username:</span>{" "}
            {session?.user.username}
          </p>
          <p className="p-2 rounded-lg transition hover:bg-[#7747ff]/10 hover:text-[#7747ff] cursor-pointer">
            <span className="font-semibold">Email:</span>{" "}
            {session?.user.email}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4 text-sm">
          {/* BIO */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* TECH STACK */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tech Stack
            </label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
              placeholder="No Tech Stack Added, Add Some Skills!"
            />
          </div>

          {/* PROJECTS */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Projects Joined
            </label>
            <p className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7747ff]">{projects === "" ? "Nothing Yet, Join Some Projects!" : projects}</p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#7747ff] hover:bg-[#6235e0] text-white rounded-lg py-2 font-medium transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
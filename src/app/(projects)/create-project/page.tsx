"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/create-project", {
        title,
        description,
        techStack: techStack
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        status,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to create project");
        return;
      }

      toast.success("Project created successfully!");

      // reset form
      setTitle("");
      setDescription("");
      setTechStack("");
      setStatus("open");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#7747ff] mb-6">
          Create Project
        </h1>

        <div className="space-y-4 text-sm">
          {/* TITLE */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Project Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
              placeholder="Enter project title"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
              placeholder="Describe your project..."
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
              placeholder="React, Node.js, MongoDB"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate technologies with commas
            </p>
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "open" | "closed")
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#7747ff] hover:bg-[#5f37d6] text-white rounded-lg py-2 font-medium transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
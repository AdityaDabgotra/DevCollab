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
    <div className="flex min-h-[88vh] items-center justify-center px-4 py-10">
      <div className="cut-frame w-full max-w-xl p-8">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">New bench</p>
        <h1 className="display mt-2 text-4xl">
          Open a <span className="text-ember">room</span>
        </h1>

        <div className="mt-8 space-y-4 text-sm">
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field"
              placeholder="What are you building?"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="field"
              placeholder="The brief. The vibe. The ask."
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
              placeholder="React, Node.js, MongoDB"
            />
            <p className="mt-1 text-xs text-fog">Comma separated</p>
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "open" | "closed")}
              className="field bg-ink"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cut-btn w-full bg-ember py-3 font-medium text-ink disabled:opacity-50"
          >
            {loading ? "Hanging the sign..." : "Create project"}
          </button>
        </div>
      </div>
    </div>
  );
}

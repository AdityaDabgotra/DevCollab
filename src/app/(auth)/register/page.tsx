"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Form = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "projectOwner">("user");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
        role,
      });

      if (response.status === 200) {
        toast.success("Account created successfully!");
        router.replace("/login");
      } else {
        toast.error("Error creating account.");
      }
    } catch (error) {
      console.log("Error registering:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full flex flex-col p-4 rounded-md text-black bg-white">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
          Welcome to <span className="text-[#7747ff]">DevCollab</span>
        </div>

        <div className="text-sm mb-4 text-center text-[#1e0e4b]">
          Create an account and start collaborating!
        </div>

        {/* ✅ attach onSubmit to form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {/* Username */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Role Dropdown */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Select Role
            </label>
            <select
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0 bg-white"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "user" | "projectOwner")
              }
            >
              <option value="user">User</option>
              <option value="projectOwner">Project Owner</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm disabled:opacity-50"
          >
            {loading ? "Creating..." : "Submit"}
          </button>
        </form>

        <div className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link className="text-[#7747ff]" href="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;

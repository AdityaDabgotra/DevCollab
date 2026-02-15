"use client";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDebounceCallback } from "usehooks-ts";

const Form = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "projectOwner">("user");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const debouncedCheckUsername = useDebounceCallback(async (value: string) => {
    if (!value) {
      setUsernameMessage("");
      return;
    }

    try {
      setIsCheckingUsername(true);

      const response = await axios.post<ApiResponse>(
        "/api/check-unique-username",
        { username: value }
      );

      setUsernameMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message || "Error checking username"
      );
    } finally {
      setIsCheckingUsername(false);
    }
  }, 500);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    debouncedCheckUsername(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/register", {
        username,
        email,
        password,
        role,
      });

      if (response.data.success) {
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

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {/* Username */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">Username</label>
            <input
              type="text"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              required
            />

            {isCheckingUsername ? (
              <p className="text-xs text-blue-500 mt-1">
                Checking availability...
              </p>
            ) : (
              usernameMessage && (
                <p
                  className={`text-xs mt-1 ${
                    usernameMessage.toLowerCase().includes("available")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usernameMessage}
                </p>
              )
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">Email</label>
            <input
              type="email"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-600 text-sm mb-2">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 pr-10 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7747ff] mt-3.5"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Role Dropdown */}
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

          {/* Submit */}
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

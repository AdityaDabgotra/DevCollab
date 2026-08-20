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
        toast.error(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[88vh] items-center justify-center px-4 py-10">
      <div className="cut-frame w-full max-w-md p-8">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">New badge</p>
        <h1 className="display mt-2 text-4xl">
          Take a <span className="text-ember">seat</span>
        </h1>
        <p className="mt-2 text-sm text-fog">
          Create an account and start collaborating.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Username
            </label>
            <input
              type="text"
              className="field"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              required
            />
            {isCheckingUsername ? (
              <p className="mt-1 text-xs text-signal">Checking availability...</p>
            ) : (
              usernameMessage && (
                <p
                  className={`mt-1 text-xs ${
                    usernameMessage.toLowerCase().includes("available")
                      ? "text-signal"
                      : "text-ember"
                  }`}
                >
                  {usernameMessage}
                </p>
              )
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Email
            </label>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="field pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 bottom-3 text-fog hover:text-ember"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Role
            </label>
            <select
              className="field bg-ink"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "user" | "projectOwner")
              }
            >
              <option value="user">Developer</option>
              <option value="projectOwner">Project owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cut-btn mt-2 bg-signal py-3 text-sm font-semibold text-ink disabled:opacity-50"
          >
            {loading ? "Stamping badge..." : "Join the foundry"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          Already inside?{" "}
          <Link className="text-ember" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Form;

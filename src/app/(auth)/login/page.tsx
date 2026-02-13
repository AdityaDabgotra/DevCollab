"use client";
import { loginSchema } from "@/schemas/LoginSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Form = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    const result = loginSchema.safeParse({ identifier, password });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });
    console.log(res);
    
    if (res?.error) {
      toast.error("Error logging in. Please check your credentials and try again.");
      setLoading(false);
      return;
    }

    if (res?.ok) {
      toast.success("Logged in successfully!");
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full flex flex-col p-4 rounded-md text-black bg-white shadow-md">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
          Welcome back to <span className="text-[#7747ff]">DevCollab</span>
        </div>

        <div className="text-sm mb-4 text-center text-[#1e0e4b]">
          Log in to your account
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Email or Username
            </label>
            <input
              type="text"
              className="rounded border border-gray-200 text-sm w-full h-11 p-2.5 focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>

        <div className="text-sm text-center mt-6">
          Don’t have an account yet?{" "}
          <Link className="text-[#7747ff]" href="/register">
            Sign up for free!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
"use client";
import { loginSchema } from "@/schemas/LoginSchema";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Form = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: any) => {
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

    if (res?.error) {
      toast.error(
        "Error logging in. Please check your credentials and try again."
      );
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
    <div className="flex min-h-[88vh] items-center justify-center px-4">
      <div className="cut-frame w-full max-w-md p-8">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">Access</p>
        <h1 className="display mt-2 text-4xl">
          Back to the <span className="text-ember">desk</span>
        </h1>
        <p className="mt-2 text-sm text-fog">Log in and pick up where you left off.</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
              Email or username
            </label>
            <input
              type="text"
              className="field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="cut-btn mt-2 bg-ember py-3 text-sm font-semibold text-ink disabled:opacity-50"
          >
            {loading ? "Opening the gate..." : "Enter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          No desk yet?{" "}
          <Link className="text-signal" href="/register">
            Claim one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Form;

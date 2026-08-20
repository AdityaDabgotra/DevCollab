"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match confirm password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/update-password", {
        currentPassword,
        newPassword,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const field = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void
  ) => (
    <div className="relative">
      <label className="mb-2 block text-xs tracking-[0.2em] text-fog uppercase">
        {label}
      </label>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="field pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 bottom-3 text-fog hover:text-ember"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-[88vh] items-center justify-center px-4">
      <div className="cut-frame w-full max-w-md p-8">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">Lock</p>
        <h1 className="display mt-2 text-4xl">
          Change <span className="text-ember">password</span>
        </h1>
        <div className="mt-8 space-y-4 text-sm">
          {field("Current", currentPassword, setCurrentPassword, showCurrent, setShowCurrent)}
          {field("New", newPassword, setNewPassword, showNew, setShowNew)}
          {field("Confirm", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm)}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cut-btn w-full bg-ember py-3 font-medium text-ink disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

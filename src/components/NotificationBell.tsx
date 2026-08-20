"use client";

import axios from "axios";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type Notification = {
  _id: string;
  type: string;
  message: string;
  projectId?: string;
  read: boolean;
  createdAt: string;
};

const POLL_INTERVAL_MS = 20000;

const NotificationBell = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/get-notifications");
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    if (!session?.user?._id) return;

    const timeout = setTimeout(fetchNotifications, 0);
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [session?.user?._id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);

    if (next && unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      try {
        await axios.post("/api/mark-notifications-read", {});
      } catch (error) {
        console.error("Failed to mark notifications read", error);
      }
    }
  };

  if (!session?.user?._id) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog hover:text-paper"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-ink">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="cut-frame absolute right-0 top-12 z-50 max-h-96 w-80 overflow-y-auto p-2">
          <div className="px-3 py-2">
            <p className="text-xs tracking-[0.25em] text-signal uppercase">
              Notifications
            </p>
          </div>
          {notifications.length === 0 ? (
            <p className="px-3 py-4 text-sm text-fog">Nothing yet.</p>
          ) : (
            <div className="space-y-1">
              {notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.projectId ? `/projects/${n.projectId}` : "#"}
                  onClick={() => setOpen(false)}
                  className={`block border border-line px-3 py-2 text-sm hover:border-ember ${
                    n.read ? "text-fog" : "text-paper"
                  }`}
                >
                  <p>{n.message}</p>
                  <p className="mt-1 text-[10px] text-fog">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
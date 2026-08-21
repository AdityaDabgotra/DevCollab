"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import ProjectComments from "@/components/ProjectComments";

type Applicant = {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  techStack?: string[];
  role?: string;
};

type ProjectOwner = {
  _id?: string;
  username: string;
  email?: string;
  role?: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  owner: ProjectOwner | null;
  members: string[];
};
type Message = {
  projectId: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: Date | string;
};

const Page = () => {
  const { data: session } = useSession();
  const params = useParams<{ id?: string | string[] }>();
  const id = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] ?? "" : raw;
  }, [params]);

  const [showApplicants, setShowApplicants] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [project, setProject] = useState<Project>({
    id: "",
    title: "",
    description: "",
    techStack: [],
    status: "",
    owner: null,
    members: [],
  });

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await axios.post("/api/project-by-id", { id });
        if (!response.data.success) {
          return;
        }

        const data = response.data.data;

        setApplicants(data.applicants || []);
        setProject({
          id: data._id,
          title: data.title || "",
          description: data.description || "",
          techStack: data.techStack || [],
          status: data.status || "",
          owner: data.owner || null,
          members: (data.members || []).map((member: { toString?: () => string } | string) =>
            typeof member === "string" ? member : String(member)
          ),
        });
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    };
    const fetchMessages = async () => {
      try {
        const res = await axios.post("/api/get-messages", {
          projectId: id,
        });

        if (res.data.success) {
          setMessages(res.data.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    const fetchAppliedStatus = async () => {
      try {
        const res = await axios.get("/api/user-projects");
        if (res.data.success) {
          const applied = (res.data.data || []).some(
            (projectId: string) => String(projectId) === id
          );
          setAlreadyApplied(applied);
        }
      } catch (error) {
        console.error("Failed to fetch application status", error);
      }
    };
    fetchProject();
    fetchMessages();
    if (session?.user?._id) {
      fetchAppliedStatus();
    }
  }, [id, session?.user?._id]);

  const ownerId =
    typeof project.owner?._id === "string"
      ? project.owner._id
      : project.owner?._id != null
        ? String(project.owner._id)
        : "";
  const isOwner = Boolean(session?.user?._id && ownerId === session.user._id);
  const isMember = project.members.some((id) => id === session?.user?._id);
  const canChat = isOwner || isMember;

  const acceptUser = async (applicantId: string) => {
    try {
      const response = await axios.post("/api/accept-user", {
        projectId: project.id,
        applicantId,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      setApplicants((prev) => prev.filter((user) => user._id !== applicantId));

      toast.success("User Accepted");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const rejectUser = async (applicantId: string) => {
    try {
      const response = await axios.post("/api/reject-user", {
        projectId: project.id,
        applicantId,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      setApplicants((prev) => prev.filter((user) => user._id !== applicantId));

      toast.success("User Rejected");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const applyToProject = async () => {
    if (project.status !== "open" || alreadyApplied) return;

    try {
      setApplying(true);
      const response = await axios.post("/api/apply-project", {
        projectId: project.id,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      setAlreadyApplied(true);
      toast.success(`Applied to project ${project.title}`);
    } catch (error) {
      toast.error("Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !canChat) return;

    const content = newMessage.trim();
    const tempMessage: Message = {
      projectId: project.id,
      sender: session?.user?._id as string,
      senderName: session?.user?.username as string,
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await axios.post("/api/send-message", {
        projectId: project.id,
        content,
      });
      if (!response.data.success) {
        throw new Error("Failed to send");
      }
    } catch (error) {
      toast.error("Failed to send message");
      setMessages((prev) =>
        prev.filter((msg) => msg !== tempMessage)
      );
    }
  };
  const toggleProjectStatus = async () => {
    const newStatus = project.status === "open" ? "closed" : "open";

    setProject((prev) => ({
      ...prev,
      status: newStatus,
    }));

    try {
      const res = await axios.post("/api/change-project-status", {
        projectId: project.id,
        status: newStatus,
      });

      if (!res.data.success) {
        throw new Error();
      }

      toast.success(`Project ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");

      setProject((prev) => ({
        ...prev,
        status: project.status,
      }));
    }
  };
  return (
    <div className="flex min-h-[88vh] flex-col lg:flex-row">
      <div className="flex-1 px-6 py-10 lg:px-10">
        <p className="text-xs tracking-[0.3em] text-signal uppercase">Room</p>
        <h1 className="display mt-3 text-4xl md:text-6xl">
          {project.title || "Loading"}
        </h1>
        <p className="mt-2 text-xs text-fog">#{project.id}</p>
        <div className="hairline my-8" />

        <div className="cut-frame space-y-4 p-6">
          <p className="leading-7 text-fog">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-sm text-fog">
            Owner{" "}
            <span className="text-ember">
              {project.owner?.username ?? "Unknown"}
            </span>
          </p>
          <p className="text-sm text-fog">
            Status{" "}
            <span className={project.status === "open" ? "text-signal" : "text-ember"}>
              {project.status || "N/A"}
            </span>
          </p>

          {isOwner && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-signal"
                  checked={project.status === "open"}
                  onChange={toggleProjectStatus}
                />
                {project.status === "open" ? "Open for applicants" : "Closed"}
              </label>
              <button
                onClick={() => setShowApplicants(true)}
                className="cut-btn bg-ember px-4 py-2 text-sm text-ink"
              >
                View applicants
              </button>
            </div>
          )}

          {session && !isOwner && !isMember && (
            <div className="pt-2">
              <button
                onClick={applyToProject}
                disabled={applying || alreadyApplied || project.status !== "open"}
                className={`cut-btn px-4 py-2 text-sm font-medium ${
                  project.status !== "open"
                    ? "border border-line text-fog"
                    : alreadyApplied
                      ? "bg-signal/20 text-signal"
                      : "bg-ember text-ink"
                }`}
              >
                {project.status !== "open"
                  ? "Closed"
                  : applying
                    ? "Applying..."
                    : alreadyApplied
                      ? "Applied"
                      : "Apply"}
              </button>
            </div>
          )}
        </div>

        {project.id && <ProjectComments projectId={project.id} />}

        {showApplicants && (
          <div className="cut-frame mt-8 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="display text-2xl">Applicants</h3>
              <button
                onClick={() => setShowApplicants(false)}
                className="text-sm text-fog hover:text-ember"
              >
                Close
              </button>
            </div>
            {applicants.length === 0 ? (
              <p className="text-fog">No applicants yet.</p>
            ) : (
              <div className="space-y-3">
                {applicants.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="flex flex-wrap items-center justify-between gap-3 border border-line p-4"
                  >
                    <div>
                      <Link
                        href={`/user/${applicant.username}`}
                        target="_blank"
                        className="text-signal"
                      >
                        {applicant.username}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {applicant.techStack?.map((tech) => (
                          <span key={tech} className="chip">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptUser(applicant._id)}
                        className="cut-btn bg-signal px-3 py-1 text-sm text-ink"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectUser(applicant._id)}
                        className="cut-btn border border-ember px-3 py-1 text-sm text-ember"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="flex min-h-[70vh] w-full flex-col border-t border-line lg:w-96 lg:border-t-0 lg:border-l">
        <div className="border-b border-line p-4">
          <h3 className="display text-xl">Signal</h3>
        </div>
        {!canChat ? (
          <div className="flex-1 px-4 py-6 text-sm text-fog">
            Chat opens after you join this project.
          </div>
        ) : (
          <>
            <div className="message flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => {
                const senderId =
                  typeof message.sender === "string"
                    ? message.sender
                    : String(message.sender);
                const isMe = senderId === session?.user?._id;

                return (
                  <div
                    key={index}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 text-sm ${
                        isMe
                          ? "cut-btn bg-ember text-ink"
                          : "border border-line text-paper"
                      }`}
                    >
                      {!isMe && (
                        <p className="mb-1 text-xs text-signal">
                          {message.senderName}
                        </p>
                      )}
                      <p>{message.content}</p>
                      <p className="mt-1 text-right text-[10px] opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-line p-4">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  type="text"
                  placeholder="Send a signal..."
                  className="field"
                />
                <button
                  onClick={sendMessage}
                  className="cut-btn bg-signal px-4 text-ink"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default Page;
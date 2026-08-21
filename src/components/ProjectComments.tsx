"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type Comment = {
  _id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
};

type ProjectCommentsProps = {
  projectId: string;
};

const ProjectComments = ({ projectId }: ProjectCommentsProps) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchComments = async () => {
      try {
        const res = await axios.post("/api/get-comments", { projectId });
        if (res.data.success) {
          setComments(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();
  }, [projectId]);

  const handlePost = async () => {
    const content = newComment.trim();
    if (!content) return;

    try {
      setPosting(true);
      const res = await axios.post("/api/post-comment", {
        projectId,
        content,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setComments((prev) => [...prev, res.data.data]);
      setNewComment("");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="cut-frame mt-8 p-6">
      <h3 className="display text-2xl">Discussion</h3>
      <div className="hairline my-4" />

      {comments.length === 0 ? (
        <p className="text-fog">No comments yet. Start the discussion.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border border-line p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-signal">{comment.authorName}</p>
                <p className="text-[10px] text-fog">
                  {new Date(comment.createdAt).toLocaleTimeString([], {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-paper">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {session ? (
        <div className="mt-6 flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePost();
            }}
            type="text"
            placeholder="Add a comment..."
            className="field"
          />
          <button
            onClick={handlePost}
            disabled={posting || !newComment.trim()}
            className="cut-btn bg-signal px-4 text-ink disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-fog">Log in to join the discussion.</p>
      )}
    </div>
  );
};

export default ProjectComments;
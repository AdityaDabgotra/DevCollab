import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  projectId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorName: string;
  content: string;
}

const CommentSchema = new Schema<IComment>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },

    authorName: {
      type: String,
      required: [true, "Author Name is required"],
      trim: true,
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel: Model<IComment> =
  mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
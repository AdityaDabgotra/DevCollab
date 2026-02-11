import mongoose, { Schema } from "mongoose";

export interface Projects {
  title: string;
  description: string;
  techStack: string[];
  owner: string;
  applicants: string[];
  status: string;
  members: string[];
}

const ProjectSchema: Schema<Projects> = new Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  techStack: {
    type: [String],
    default: [],
  },
  owner: {
    type: String,
    required: [true, "Owner is Required"],
  },
  applicants: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  members: {
    type: [String],
    default: [],
  },
})

const ProjectModel = (mongoose.models.Project as mongoose.Model<Projects>) || (mongoose.model<Projects>("Project", ProjectSchema))

export default ProjectModel;
import mongoose, { Schema } from "mongoose";

export interface Message {
    projectId: string;
    sender: string;
    content: string;
    timestamp: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    projectId: {
        type: String,
        required: [true, "Project ID is Required"],
    },
    sender: {
        type: String,
        required: [true, "Sender is Required"],
    },
    content: {
        type: String,
        required: [true, "Content is Required"],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>("Message", MessageSchema))

export default MessageModel;
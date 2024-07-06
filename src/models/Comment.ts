import { Schema, models, model, Document, Types } from "mongoose";
import { IUser } from "./User"

export interface IComment extends Document  {
    text: string,
    author: IUser["_id"],
}

const commentSchema = new Schema<IComment>({
    text: {
        type: String,
        required: [true, "Please provide text"],
    },
    author: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "Only agents and admins can make listings"],
    },
},{
    timestamps: true,
})

const Comment = models.Comment || model<IComment>("Comment", commentSchema);

export default Comment;
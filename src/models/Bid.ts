import { Schema, model, models, Document, Types } from "mongoose";
import { IUser } from "./User"
import { IListing } from "./Listing"

export interface IBid extends Document {
    bidder: IUser["_id"],
    agent: IUser["_id"],
    listing: IListing["_id"],
    bidAmount: number,
    status: string,
    feedBackFromAgent: string,
}

const bidSchema = new Schema<IBid>({
    bidder: {
        type: Types.ObjectId,
        ref: "users",
        required: [true, "You must be a user to make a bid"],
    },
    agent: {
        type: Types.ObjectId,
        ref: "users",
        required: [true, "You must be a user to make a bid"],
    },
    listing: {
        type: Types.ObjectId,
        ref: "listings",
        required: [true, "No listing found"],
    },
    bidAmount: {
        type: Number,
        required: [true, "Please provide an amount you wish to bid with"],
    },
    status: {
        type: String,
        default: "pending",
        enum: ["rejected", "accepted", "pending"]
    },
    feedBackFromAgent: {
        type: String,
    },
},{
    timestamps: true,
})

const Bid = models.Bid || model<IBid>("Bid", bidSchema);

export default Bid;
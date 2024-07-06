import { Schema, models, model, Document, Types } from "mongoose";
import { IUser } from "./User"

interface Image{
    _id: number,
    url: string,
}

export interface IListing extends Document {
    title: string,
    type: string,
    description: string,
    price: number,
    isPriceNegotiable: boolean,
    country: string,
    state: string,
    lga: string,
    street: string,
    address: string,
    author: IUser["_id"],
    numberOfRooms: number,
    numberOfBathrooms: number,
    numberOfGarage: number,
    isBathroomInDoors: boolean,
    isKitchenIndoors: boolean,
    featuredImg: string,
    galleryImgs: Image[],
    video: string,
    virtualTour: string,
    amenities: string[],
    comments: Types.ObjectId[],
    interestedUsers: Types.ObjectId[],
    visits: number,
}

const listingsSchema = new Schema<IListing>({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        unique: true,
    },
    type: {
        type: String,
        required: [true, "Please provide a property type"],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
    },
    isPriceNegotiable: {
        type: Boolean,
        default: false,
    },
    country: {
        type: String,
        required: [true, "Please provide a country"],
    },
    state: {
        type: String,
        required: [true, "Please provide a state"],
    },
    lga: {
        type: String,
        required: [true, "Please provide a local government area"],
    },
    street: {
        type: String,
        required: [true, "Please provide a street"],
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
    },
    author: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "Only authors and admins can make listings"],
    },
    numberOfRooms: {
        type: Number,
        required: [true, "Please the number of rooms"],
    },
    numberOfBathrooms: {
        type: Number,
        required: [true, "Please the number of bathrooms"],
    },
    numberOfGarage: {
        type: Number,
        default: 0,
    },
    isBathroomInDoors: {
        type: Boolean,
        default: true,
    },
    isKitchenIndoors: {
        type: Boolean,
        default: true,
    },
    featuredImg: {
        type: String,
        required: [true, "Listing must have a featured image"],
    },
    galleryImgs: {
        type: [{
            _id: Number,
            url: String,
        }],
    },
    video: {
        type: String,
        required: [true, "Listing must have a video"],
    },
    virtualTour: {
        type: String,
    },
    amenities: {
        type: [String],
    },
    comments: [{
        type: Types.ObjectId,
        ref: "Comment",
    }],
    interestedUsers: [{
        type: Types.ObjectId,
        ref: "User",
    }],
    visits: {
        type: Number,
        default: 0,
    },
},{
    timestamps: true,
})

const Listing = models.Listing || model<IListing>("Listing", listingsSchema);

export default Listing;
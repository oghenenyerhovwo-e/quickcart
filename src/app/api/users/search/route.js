import { NextResponse } from "next/server";
import {
    User,
  } from "@/models";
  
  import {
    getDataFromToken,
    pageLimit,
} from "@/helpers"
  
  import {
    databaseConnection,
  } from '@/config';

databaseConnection()

export const GET = async (request) => {
  try {
    const url  = new URL(request.url) 
    const searchText = url.searchParams.get("searchText")
    const pageIndex = url.searchParams.get("pageIndex") || 1
    
    if(!searchText){
      return NextResponse.json({
        message: "Articles found successfully",
        articles: [],
      })
    }
    
    const userId = await getDataFromToken(request);
    const foundUser = await User.findOne({_id: userId}).select("-password");

    if(!foundUser){
      return NextResponse.json({error: "No user found, Please login"}, {status: 400})
    } 

    if(!foundUser.isActive){
      return NextResponse.json({error: "user has been blocked, contact admin"}, {status: 400})
    }

    if(!foundUser.isAdmin){
        return NextResponse.json({error: "You must be the admin to be able to fetch all users"}, {status: 400})
    }

    // Pagination with skip and limit
    const skip = (pageIndex - 1) * pageLimit;
    const searchQuery = {
      $or: [
        { fullName: { $regex: searchText, $options: 'i' } }, // Case-insensitive search for fullName
        { email: { $regex: searchText, $options: 'i' } }, // Case-insensitive search for email
      ],
      $and: [
        { fullName: { $ne: searchText } }, // Exclude exact matches for fullName
        { email: { $ne: searchText } }, // Exclude exact matches for email
      ],
    }
    const users = await User
      .find(searchQuery)
      .sort({
          _id: -1,
      })
      .skip(skip)
      .limit(pageLimit)
      .select("-password")

    const totalUsers = await User.countDocuments(searchQuery);
    const pageCount = Math.ceil(totalUsers / pageLimit);

    const response = NextResponse.json({
        message: "Users found successfully",
        users,
        pageCount,
    })

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: error.message}, {status: 400});
  }
}
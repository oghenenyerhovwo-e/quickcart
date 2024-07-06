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
        const pageIndex = url.searchParams.get("pageIndex") || 1

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
        
        const foundUsers = await User
          .find({isAdmin: false})
          .sort({
              _id: -1,
          })
          .skip(pageIndex - 1)
          .limit(pageLimit)
          .select("-password")

        const totalUsers = await User.countDocuments({isAdmin: false})
        const pageCount = Math.ceil(totalUsers / pageLimit);

        const response = NextResponse.json({
            message: "Users found successfully",
            users: foundUsers,
            pageCount: pageCount,
        })

      return response;
  } catch (error) {
      return NextResponse.json({error: error.message}, {status: 400});
  }
}

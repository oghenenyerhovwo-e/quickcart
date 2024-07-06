import { NextResponse } from "next/server";
import {
    User,
  } from "@/models";
  
  import {
    getDataFromToken,
  } from "@/helpers"
  
  import {
    databaseConnection,
  } from '@/config';

databaseConnection()

export async function GET(request){
    try {
        const userId = await getDataFromToken(request);
        const foundUser = await User.findOne({_id: userId}).select("-password");
        
        if(!foundUser){
          return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }     
        
        const response = NextResponse.json({
            message: "User found",
            user: foundUser
        })

      return response
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}
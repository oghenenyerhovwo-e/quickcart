import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
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

export const PUT = async (request, { params }) => {  
  try {
        const {password, isActive} = await request.json();
        
        const userId = await getDataFromToken(request);
        const foundUser = await User.findOne({_id: userId});
        const foundProfile = await User.findOne({_id: params.id}).select("-password");

        if(!foundUser){
          return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }     
        
        if(!foundUser.isActive){
          return NextResponse.json({error: "user has been blocked contact admin"}, {status: 400})
        }

        if(!foundUser.isAdmin){
            return NextResponse.json({error: "You must be the admin to be able to fetch all users"}, {status: 400})
        }

        if(foundProfile.isAdmin){
          return NextResponse.json({error: "admin role cannot be changed"}, {status: 400})
        }
        //check if old password is correct
        const isPasswordValid = await bcryptjs.compare(password, foundUser.password)
        if(!isPasswordValid){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        foundProfile.isActive = isActive
        const updatedProfile = await foundProfile.save()
        const response = NextResponse.json({
            message: "user updated successfully",
            userId: updatedProfile._id,
        })

        return response;
  } catch (error) {
      return NextResponse.json({error: error.message}, {status: 400});
  }
}

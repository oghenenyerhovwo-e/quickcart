import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import {
    User,
  } from "@/models";
  
  import {
    getDataFromToken,
    isPasswordSafe,
  } from "@/helpers"
  
  import {
    databaseConnection,
  } from '@/config';

databaseConnection()

export const GET = async (request, { params }) => {  
  try {
        const userId = await getDataFromToken(request);
        const foundUser = await User.findOne({_id: userId}).select("-password");
        const foundProfile = await User.findOne({_id: params.id}).select("-password");
        
        if(!foundUser){
          return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }     
        
        if(!foundUser.isActive){
            return NextResponse.json({error: "user has been blocked, contact admin"}, {status: 400})
          }

        if(!foundUser.isAdmin && String(foundProfile._id) !== String(foundUser._id)){
            return NextResponse.json({error: "You must be the admin or the owner of this profile to be able to fetch it"}, {status: 400})
        }

        const response = NextResponse.json({
            message: "Profile found successfully",
            user: foundProfile,
        })

      return response;
  } catch (error) {
      return NextResponse.json({error: error.message}, {status: 400});
  }
}

export const PUT = async (request, { params }) => {    
    try {
        const { fullName, email, profilePic, oldPassword, newPassword } = await request.json();
    
        const userId = await getDataFromToken(request);
        const foundUser = await User.findOne({_id: userId});
        const foundProfile = await User.findOne({_id: params.id});

        if(!foundUser){
          return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }     

        if(!foundUser.isActive){
            return NextResponse.json({error: "user has been blocked, contact admin"}, {status: 400})
          }

        if(String(foundProfile._id) !== String(foundUser._id)){
            return NextResponse.json({error: "You must be the owner of this profile to be able to edit it"}, {status: 400})
        }

        // check if password is safe
        if(newPassword && !isPasswordSafe(newPassword)){
          return NextResponse.json({error: "password must be at least 8 characters long and contain at least one capital letter, a special symbol and a number"}, {status: 400})
        }

        //check if old password is correct
        const isPasswordValid = await bcryptjs.compare(oldPassword, foundProfile.password)
        if(!isPasswordValid){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        foundProfile.fullName = fullName || foundProfile.fullName
        foundProfile.email = email || foundProfile.email
        foundProfile.password = newPassword ? await bcryptjs.hash(newPassword, salt) : foundProfile.password
        foundProfile.profilePic = profilePic || foundProfile.profilePic

        const updateUser = await foundProfile.save()
        const response = NextResponse.json({
            message: "Article updated successfully",
            userId: updateUser._id,
        })

      return response
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}


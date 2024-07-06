import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

import {
  User,
} from "@/models";

import {
  databaseConnection,
} from '@/config';

import {
    generateToken,
} from "@/helpers"

databaseConnection()

export async function POST(request){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody;
        
        //check if user exists
        const foundUser = await User.findOne({email})
        if(!foundUser){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }        
        
        //check if password is correct
        const isPasswordValid = await bcryptjs.compare(password, foundUser.password)
        if(!isPasswordValid){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        
        //create token data
        const userData = {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            profilePic: foundUser.profilePic,
            isAdmin: foundUser.isAdmin,
        }
        //create token
        const token = await generateToken(userData, "1d")

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: foundUser,
        })
        
        response.cookies.set(process.env.COOKIES_NAME, token, {
            httpOnly: true, 
        })

        return response

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
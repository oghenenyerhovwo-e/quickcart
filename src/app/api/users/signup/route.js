import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

import {
  User,
} from "@/models";

import {
    isPasswordSafe,
    getDataFromToken,
} from "@/helpers"

import {
  databaseConnection,
} from '@/config';

databaseConnection()

export async function POST(request){
    try {
        const {fullName, email, password, profilePic, adminPassword } = await request.json()

        const userId = await getDataFromToken(request);

        const foundUser = await User.findOne({_id: userId})

        if(!foundUser){
            return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }     

        if(!foundUser.isActive){
          return NextResponse.json({error: "user has been blocked contact admin"}, {status: 400})
        }

        if(!foundUser.isAdmin){
            return NextResponse.json({error: "You must be the admin or the author of this article to be able to delete it"}, {status: 400})
        }

        //check if user already exists
        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        //check if password is correct
        const isAdminPasswordValid = await bcryptjs.compare(adminPassword, foundUser.password)
        if(!isAdminPasswordValid){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        
        // check if password is safe
        if(!isPasswordSafe(password)){
            return NextResponse.json({error: "password must be at least 8 characters long and contain at least one capital letter, a special symbol and a number"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            profilePic,
            password: hashedPassword,
        })

        const savedUser = await newUser.save()

        const response = NextResponse.json({
            message: "User created successfully",
            success: true,
            userId: savedUser._id,
        })

        return response

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}
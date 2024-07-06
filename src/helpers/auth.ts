import jwt from 'jsonwebtoken';
import bcryptjs from "bcryptjs";

// functions and objects
import { User } from "@/models";

export const generateToken= async (
    _id: string, 
    type: string, 
    duration: string,
  ) => {
  try {
    const token=  jwt.sign(
      {
        _id,
        type,
      },
      process.env?.JWT_SECRET!, 
      {
        expiresIn: duration || "1d"
      }
    )
    return token
  } catch (error: any) {
    console.log(error)
  }
}

export const getDataFromToken = (token: any, type: string) => {
  try {
      const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);
      if(type === decodedToken.type){
        return decodedToken._id
      }
      throw new Error("Invalid Token");
  } catch (error: any) {
      throw new Error(error.message);
  }
}

export const isPasswordSafe = (password: string) => {
  // Check if the password is 8 characters long
  if (password.length < 8) {
      return false;
  }

  // Check if the password contains at least one uppercase letter, one lowercase letter, one symbol, and one number
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const symbolRegex = /[^A-Za-z0-9]/; // Match any character that is not alphanumeric
  const numberRegex = /\d/; // Match any digit

  if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !symbolRegex.test(password) || !numberRegex.test(password)) {
      return false;
  }

  // If all criteria are met, return true
  return true;
}

export const generateHashedToken = async (userId: any, tokenType: string) => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)
    const foundUser = await User.findById(userId)
    let savedUser;

    if (tokenType === "VERIFY_EMAIL") {
        foundUser.verifyToken = hashedToken
        foundUser.verifyTokenExpiry = Date.now() + 3600000
        savedUser = await foundUser.save()
    } else if (tokenType === "RESET_PASSWORD"){
        foundUser.forgotPasswordToken = hashedToken
        foundUser.forgotPasswordTokenExpiry = Date.now() + 3600000
        savedUser = await foundUser.save()
    }

    if(!savedUser){
      return "";
    }
    return hashedToken;
  } catch (error: any) {
    return "";
  }
}

export const getHashedTokenData = async (token: string, tokenType: string) => {
  try {
    let savedUser;

    if (tokenType === "VERIFY_EMAIL") {
        const foundUser = await User.findOne({verifyToken: token, });

        if (!foundUser) {
          throw new Error("Invalid or Expired Token");
        }
        foundUser.verifyToken = undefined
        foundUser.verifyTokenExpiry = undefined
        savedUser = await foundUser.save()
    } else if (tokenType === "RESET_PASSWORD"){
        const foundUser = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}});

        if (!foundUser) {
          throw new Error("Invalid or Expired Token");
        }
        foundUser.forgotPasswordToken = undefined
        foundUser.forgotPasswordTokenExpiry = undefined
        savedUser = await foundUser.save()
    }

    if(!savedUser){
      return "";
    }
    return savedUser._id;
  } catch (error: any) {
    return "";
  }  
  
}

import { NextResponse } from "next/server";
import {
    Article,
    Comment,
  } from "@/models";
  
  import {
    getDataFromToken,
  } from "@/helpers"
  
  import {
    databaseConnection,
  } from '@/config';

databaseConnection()

export const POST = async (request, { params }) => {   
    try {
        const { text, fullName, email } = await request.json();
        const data = { 
          text, 
          fullName: fullName || "Anonymous", 
          email,
        }

        const foundArticle = await Article.findOne({_id: params.articleId});

        if(!foundArticle){
            return NextResponse.json({error: "No Article was found"}, {status: 400})
        }  

        const newComment = new Comment({
            ...data,
        })

        const savedComment = await newComment.save()
        
        foundArticle.comments.push(savedComment._id)
        const savedArticle = await foundArticle.save()

        const response = NextResponse.json({
            message: "Comment created successfully",
            commentId: savedComment._id,
            articleId: savedArticle._id,
        })

      return response
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}

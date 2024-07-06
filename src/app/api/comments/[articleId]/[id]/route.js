import { NextResponse } from "next/server";
import {
    Article,
    Comment,
    User,
  } from "@/models";
  
  import {
    getDataFromToken,
  } from "@/helpers"
  
  import {
    databaseConnection,
  } from '@/config';

databaseConnection()

export const DELETE = async (request, { params }) => {    
  try {
      const userId = await getDataFromToken(request);

      const foundUser = await User.findOne({_id: userId}).select("-password");
      const foundArticle = await Article.findOne({_id: params.articleId})

      if(!foundUser){
        return NextResponse.json({error: "No user found, Please login"}, {status: 400})
      }     

      if(!foundUser.isActive){
        return NextResponse.json({error: "user has been blocked, contact admin"}, {status: 400})
      }

      if(!foundUser.isAdmin){
          return NextResponse.json({error: "You must be the admin to be able to delete comment"}, {status: 400})
      }

      const filteredComment = foundArticle.comments.filter(comment => String(comment._id) !== String(params.id))
      foundArticle.comments = filteredComment
      
      const savedArticles = await foundArticle.save()

      const deletedComment = await Comment.findByIdAndDelete(params.id)

      const response = NextResponse.json({
          message: "Comment deleted successfully",
          articleId: savedArticles._id,
          commentId: deletedComment._id,
      })

    return response
  } catch (error) {
      return NextResponse.json({error: error.message}, {status: 400});
  }
}

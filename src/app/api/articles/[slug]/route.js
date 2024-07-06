import { NextResponse } from "next/server";
import {
    Article,
    User,
    Comment,
} from "@/models";
  
import {
  getDataFromToken,
  makeSlug,
  cleanHTML,
} from "@/helpers"
  
import {
  databaseConnection,
} from '@/config';

databaseConnection()

export const GET = async (request, { params }) => {  
  try {
      const foundArticle = await Article
        .findOne({slug: params.slug})
        .populate({
          path: "author",
          select: "-password",
        })
        .populate("comments")

        const response = NextResponse.json({
            message: "Article found successfully",
            article: foundArticle,
        })
      return response;
  } catch (error) {
      return NextResponse.json({error: error.message}, {status: 400});
  }
}

export const PUT = async (request, { params }) => {    
    try {
        const data = await request.json();
        const userId = await getDataFromToken(request);

        const foundUser = await User.findOne({_id: userId}).select("-password");
        const foundArticle = await Article
        .findOne({slug: params.slug})
      
        if(!foundUser){
          return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }

        if(!foundArticle){
          return NextResponse.json({error: "No article found"}, {status: 400})
        }
        
        if(!foundUser.isActive){
          return NextResponse.json({error: "user has been blocked, contact admin"}, {status: 400})
        }

        if(String(foundArticle.author) !== String(foundUser._id)){
            return NextResponse.json({error: "You must be the author of this article to be able to edit it"}, {status: 400})
        }

        foundArticle.title = data.title || foundArticle.title
        foundArticle.slug = data.title ? makeSlug(data.title): foundArticle.slug
        foundArticle.headline = data.headline || foundArticle.headline
        foundArticle.category = (data.category && data.category.length > 0)? data.category : foundArticle.category
        foundArticle.content = (data.content && cleanHTML(data.content)) || foundArticle.content
        foundArticle.image = data.image || foundArticle.image
        foundArticle.source = data.source || foundArticle.source
        foundArticle.tags = data.tags || foundArticle.tags
        foundArticle.modifiedDate = new Date()
        
        const updatedArticle = await foundArticle.save()

        const response = NextResponse.json({
            message: "Article updated successfully",
            articleSlug: updatedArticle.slug,
        })

      return response
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}

export const DELETE = async (request, { params }) => {    
    try {
        const userId = await getDataFromToken(request);

        const foundUser = await User.findOne({_id: userId}).select("-password");
        const foundArticle = await Article.findOne({slug: params.slug})

        if(!foundUser){
          return NextResponse.json({error: "No user found, Please login"}, {status: 400})
        }
        
        if(!foundArticle){
          return NextResponse.json({error: "No article found"}, {status: 400})
        }  

        if(!foundUser.isActive){
          return NextResponse.json({error: "user has been blocked contact admin"}, {status: 400})
        }

        if(!foundUser.isAdmin && String(foundArticle.author) !== String(foundUser._id)){
            return NextResponse.json({error: "You must be the admin or the author of this article to be able to delete it"}, {status: 400})
        }

        for (let i=0; i < foundArticle.comments.length; i++){
          const comment = foundArticle.comments[i]
          const deletedComment = await Comment.findByIdAndDelete(comment)
        }

        await Article.findByIdAndDelete(foundArticle._id)
        
        const response = NextResponse.json({
            message: "Article deleted successfully",
            articleSlug: params.slug,
        })

      return response
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}

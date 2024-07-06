import { NextResponse } from "next/server";
import {
    Article,
  } from "@/models";
  
  import {
    databaseConnection,
  } from '@/config';

databaseConnection()

export const GET = async (request, { params }) => {  
  try {
        const foundArticle = await Article
            .findOne({slug: params.slug})

        if(!foundArticle){
          return NextResponse.json({error: "No article found"}, {status: 400})
        }
        const { slug, category, tags } = foundArticle

        const relatedQuery = {
            slug: { $ne: slug }, // Exclude the current article
            $or: [ // Optional: Consider category and/or tags if applicable
              category ? { category: category } : {},
              tags ? { tags: { $in: tags } } : {},
            ],
          };
      
        const relatedArticles = await Article
          .find(relatedQuery)
          .sort({ relevance: -1 })
          .limit(6)
          .populate({
            path: "author",
            select: "-password",
          })

        const response = NextResponse.json({
            message: "Articles found successfully",
            articles: relatedArticles,
        })

      return response;
  } catch (error) {
      return NextResponse.json({error: error.message}, {status: 400});
  }
}

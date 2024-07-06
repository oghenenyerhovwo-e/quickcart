import { NextResponse } from "next/server";
import {
    Article,
  } from "@/models";
  
  import {
    databaseConnection,
  } from '@/config';

import {
  pageLimit,
} from "@/helpers"

databaseConnection()

export const GET = async (request, { params }) => {
  try {
    const url  = new URL(request.url) 
    const searchText = url.searchParams.get("searchText")
    const pageIndex = url.searchParams.get("pageIndex") || 1
    
    if(!searchText){
      return NextResponse.json({
        message: "Articles found successfully",
        articles: [],
      })
    }
    // Create a text index for efficient searching
    const articleSchema = Article.schema; // Get the schema
    if (!articleSchema.indexes().find((index) => index.name === 'textIndex')) { // Check if index exists
      await articleSchema.index({ title: 'text', headline: 'text', category: 'text', content: 'text', tags: 'text' }, { name: 'textIndex' }); // Create text index
    }

    // Full-text search using $text and $regex for flexibility
    const searchQuery = {
      $or: [
        { title: { $regex: searchText, $options: 'i' } },
        { content: { $regex: searchText, $options: 'i' } },
        { headline: { $regex: searchText, $options: 'i' } },
        { slug: { $regex: searchText, $options: 'i' } },
        { category: { $regex: searchText, $options: 'i' } },
        { source: { $regex: searchText, $options: 'i' } },
        { tags: { $regex: searchText, $options: 'i' } },
      ],
    }

    // Pagination with skip and limit
    const skip = (pageIndex - 1) * pageLimit;

    const articles = await Article
      .find(searchQuery) // Include search score
      .sort({ relevance: -1 })
      .skip(skip)
      .limit(pageLimit) // Sort by relevance and paginate
      .populate({
        path: "author",
        select: "-password",
      })

    const totalArticles = await Article.countDocuments(searchQuery); // Count total matching articles
    const pageCount = Math.ceil(totalArticles / pageLimit);

    const response = NextResponse.json({
        message: "Articles found successfully",
        articles,
        pageCount,
    })

return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: error.message}, {status: 400});
  }
}
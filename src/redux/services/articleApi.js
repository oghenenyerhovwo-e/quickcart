import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const articleApi = createApi({
  reducerPath: "articleApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    // Fill in your own server starting URL here
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/articles`,
  }),
  endpoints: builder => ({
    getArticles: builder.query({
      query: (params) => `?pageIndex=${params.pageIndex}`,
    }),
    getArticleBySlug: builder.query({
      query: (params) => `/${params.slug}`,
    }),
    getRelatedArticlesBySlug: builder.query({
      query: (params) => `/${params.slug}/related`,
    }),
    getArticlesByCategory: builder.query({
      query: (params) => `/category/?category=${params.category}&pageIndex=${params.pageIndex}`,
    }),
    getArticlesByAuthor: builder.query({
      query: (params) => `/author/${params.authorId}?pageIndex=${params.pageIndex}`,
    }),
    postArticle: builder.mutation({
      query: (params) => ({
        url: `/`,
        method: "POST",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    deleteArticle: builder.mutation({
      query: (params) => ({
        url: `/${params.slug}`,
        method: "DELETE",
      }),
    }),
    updateArticle: builder.mutation({
      query: (params) => ({
        url: `/${params.slug}`,
        method: "PUT",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    searchArticles: builder.query({
      query: (params) => `/search?searchText=${params.searchText}&pageIndex=${params.pageIndex}`,
    }),
  })
})

export const { 
  useGetArticlesQuery, 
  useGetArticleBySlugQuery,
  useGetRelatedArticlesBySlugQuery,
  useGetArticlesByCategoryQuery,
  useGetArticlesByAuthorQuery,
  useSearchArticlesQuery,
  usePostArticleMutation,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
} = articleApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const commentApi = createApi({
  reducerPath: "commentApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    // Fill in your own server starting URL here
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/comments`,
  }),
  endpoints: builder => ({
    postComment: builder.mutation({
      query: (params) => ({
        url: `/${params.articleId}`,
        method: "POST",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    deleteComment: builder.mutation({
      query: (params) => ({
        url: `/${params.articleId}/${params.id}`,
        method: "DELETE",
        header: {"Content-Type": "application/json"}
      }),
    }),
  })
})

export const { 
  usePostCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
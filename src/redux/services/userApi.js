import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    // Fill in your own server starting URL here
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/users`,
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: (params) => ({
        url: `/login`,
        method: "POST",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    signup: builder.mutation({
      query: (params) => ({
        url: `/signup`,
        method: "POST",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
        body: {},
        header: {"Content-Type": "application/json"}
      }),
    }),
    getUserIdentity: builder.query({
      query: () => `/identity`,
    }),
    getUserProfile: builder.query({
      query: (params) => `/${params.id}`,
    }),
    getUsers: builder.query({
      query: (params) => `?pageIndex=${params.pageIndex}`,
    }),
    updateUserProfile: builder.mutation({
      query: (params) => ({
        url: `/${params.id}`,
        method: "PUT",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    changeUserRole: builder.mutation({
      query: (params) => ({
        url: `/${params.id}/activation`,
        method: "PUT",
        body: params.body,
        header: {"Content-Type": "application/json"}
      }),
    }),
    searchUsers: builder.query({
      query: (params) => `/search?searchText=${params.searchText}&pageIndex=${params.pageIndex}`,
    }),
  })
})

export const { 
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useUpdateUserProfileMutation,
  useChangeUserRoleMutation,
  useGetUserIdentityQuery,
  useGetUserProfileQuery,
  useGetUsersQuery,
  useSearchUsersQuery,
} = userApi;
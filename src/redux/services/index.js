import {
    articleApi,
    useGetArticlesQuery,
    useGetArticleBySlugQuery,
    useGetArticlesByCategoryQuery,
    useGetArticlesByAuthorQuery,
    usePostArticleMutation,
    useDeleteArticleMutation,
    useSearchArticlesQuery,
    useGetRelatedArticlesBySlugQuery,
    useUpdateArticleMutation,
} from "./articleApi"

import {
    commentApi,
    usePostCommentMutation,
    useDeleteCommentMutation,
} from "./commentApi"

import {
    userApi,
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useGetUserIdentityQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetUsersQuery,
    useChangeUserRoleMutation,
    useSearchUsersQuery,
} from "./userApi.js"

export {
    articleApi,
    useGetArticlesQuery,
    useGetArticleBySlugQuery,
    useGetArticlesByCategoryQuery,
    useGetArticlesByAuthorQuery,
    usePostArticleMutation,
    useDeleteArticleMutation,
    useSearchArticlesQuery,
    useGetRelatedArticlesBySlugQuery,
    useUpdateArticleMutation,

    commentApi,
    usePostCommentMutation,
    useDeleteCommentMutation,

    userApi,
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useGetUserIdentityQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetUsersQuery,
    useChangeUserRoleMutation,
    useSearchUsersQuery,
}
import {
    useAppDispatch,
    useAppSelector,
    useAppStore,
} from "./hooks.js"

import {
    makeStore,
} from "./store.js"

import {
    useGetArticlesQuery,
    useGetArticleBySlugQuery,
    useGetArticlesByCategoryQuery,
    useGetArticlesByAuthorQuery,
    usePostArticleMutation,
    useDeleteArticleMutation,
    useSearchArticlesQuery,
    useGetRelatedArticlesBySlugQuery,
    useUpdateArticleMutation,

    usePostCommentMutation,
    useDeleteCommentMutation,

    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useGetUserIdentityQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetUsersQuery,
    useChangeUserRoleMutation,
    useSearchUsersQuery,
} from "./services"

import {
    setCurrentUser, 
    setIsIdentityLoadComplete,
} from "./features"

export {
    makeStore,
    useAppDispatch,
    useAppSelector,
    useAppStore,

    useGetArticlesQuery,
    useGetArticleBySlugQuery,
    useGetArticlesByCategoryQuery,
    useGetArticlesByAuthorQuery,
    usePostArticleMutation,
    useDeleteArticleMutation,
    useSearchArticlesQuery,
    useGetRelatedArticlesBySlugQuery,
    useUpdateArticleMutation,

    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useGetUserIdentityQuery,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetUsersQuery,
    useChangeUserRoleMutation,
    useSearchUsersQuery,

    usePostCommentMutation,
    useDeleteCommentMutation,

    setCurrentUser, 
    setIsIdentityLoadComplete,
}
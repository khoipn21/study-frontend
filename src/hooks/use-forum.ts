import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { forumApi } from '@/lib/api/forum'

import type { CreatePostRequest, CreateTopicRequest } from '@/lib/api/forum'

// Topic hooks
export function useTopics(params?: {
  page?: number
  limit?: number
  category?: string
  courseId?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['topics', params],
    queryFn: () => forumApi.getTopics(params),
  })
}

export function useTopic(topicId: string) {
  return useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => forumApi.getTopic(topicId),
    enabled: !!topicId,
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      authToken,
    }: {
      data: CreateTopicRequest
      authToken?: string
    }) => forumApi.createTopic(data, authToken),
    onSuccess: () => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useUpdateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      topicId,
      data,
      authToken,
    }: {
      topicId: string
      data: Partial<CreateTopicRequest>
      authToken?: string
    }) => forumApi.updateTopic(topicId, data, authToken),
    onSuccess: (_, { topicId }) => {
      // Invalidate specific topic and topics list
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useDeleteTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      topicId,
      authToken,
    }: {
      topicId: string
      authToken?: string
    }) => forumApi.deleteTopic(topicId, authToken),
    onSuccess: () => {
      // Invalidate topics list
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

// Post hooks
export function usePosts(
  topicId: string,
  params?: {
    page?: number
    limit?: number
  },
) {
  return useQuery({
    queryKey: ['posts', topicId, params],
    queryFn: () => forumApi.getPosts(topicId, params),
    enabled: !!topicId,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      topicId,
      data,
      authToken,
    }: {
      topicId: string
      data: CreatePostRequest
      authToken?: string
    }) => forumApi.createPost(topicId, data, authToken),
    onSuccess: (_, { topicId }) => {
      // Invalidate posts for this topic and update topic post count
      queryClient.invalidateQueries({ queryKey: ['posts', topicId] })
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      data,
      authToken,
    }: {
      postId: string
      data: Partial<CreatePostRequest>
      authToken?: string
    }) => forumApi.updatePost(postId, data, authToken),
    onSuccess: () => {
      // Invalidate all posts queries to refresh the updated post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      authToken,
    }: {
      postId: string
      authToken?: string
    }) => forumApi.deletePost(postId, authToken),
    onSuccess: () => {
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

// Approval hooks (requires auth)
export function usePendingTopics(authToken?: string) {
  return useQuery({
    queryKey: ['pending-topics'],
    queryFn: () => forumApi.getPendingTopics(authToken!),
    enabled: !!authToken,
  })
}

export function useApproveTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      topicId,
      authToken,
    }: {
      topicId: string
      authToken: string
    }) => forumApi.approveTopic(topicId, authToken),
    onSuccess: () => {
      // Refresh pending topics and all topics
      queryClient.invalidateQueries({ queryKey: ['pending-topics'] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useRejectTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      topicId,
      authToken,
    }: {
      topicId: string
      authToken: string
    }) => forumApi.rejectTopic(topicId, authToken),
    onSuccess: () => {
      // Refresh pending topics and all topics
      queryClient.invalidateQueries({ queryKey: ['pending-topics'] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useApprovePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      authToken,
    }: {
      postId: string
      authToken: string
    }) => forumApi.approvePost(postId, authToken),
    onSuccess: () => {
      // Refresh posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useRejectPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      authToken,
    }: {
      postId: string
      authToken: string
    }) => forumApi.rejectPost(postId, authToken),
    onSuccess: () => {
      // Refresh posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// Pin management hooks
export function useSetTopicPinOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      topicId,
      pinOrder,
      authToken,
    }: {
      topicId: string
      pinOrder: number
      authToken: string
    }) => forumApi.setTopicPinOrder(topicId, pinOrder, authToken),
    onSuccess: () => {
      // Refresh topics to show new pin order
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useSetPostPinOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      pinOrder,
      authToken,
    }: {
      postId: string
      pinOrder: number
      authToken: string
    }) => forumApi.setPostPinOrder(postId, pinOrder, authToken),
    onSuccess: () => {
      // Refresh posts to show new pin order
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// Voting hooks
export function useVotePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      voteType,
      authToken,
    }: {
      postId: string
      voteType: 'up' | 'down'
      authToken?: string
    }) => forumApi.votePost(postId, voteType, authToken),
    onSuccess: () => {
      // Refresh posts to show updated vote counts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useRemoveVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      authToken,
    }: {
      postId: string
      authToken?: string
    }) => forumApi.removeVote(postId, authToken),
    onSuccess: () => {
      // Refresh posts to show updated vote counts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

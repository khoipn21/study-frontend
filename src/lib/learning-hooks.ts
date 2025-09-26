import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api-client'
import { useAuth } from './auth-context'

// Types
export type StudentNote = {
  id: string
  user_id: string
  course_id: string
  lecture_id: string
  content: string
  video_timestamp?: number
  created_at: string
  updated_at: string
}

export type LearningProgress = {
  course_id: string
  lecture_id: string
  progress_percentage: number
  watch_time_seconds: number
  is_completed: boolean
  last_watched_at: string
}

// Progress tracking hook with automatic intervals
export function useProgressTracking(courseId: string, lectureId: string) {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [watchTime, setWatchTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Track progress mutation
  const trackProgressMutation = useMutation({
    mutationFn: (data: {
      progress_percentage: number
      watch_time_seconds: number
      is_completed: boolean
    }) =>
      token
        ? api.trackProgress(token, {
            course_id: courseId,
            lecture_id: lectureId,
            ...data,
          })
        : Promise.reject('No token'),
    onSuccess: () => {
      // Invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] })
      queryClient.invalidateQueries({ queryKey: ['my-enrolled-courses'] })
    },
    onError: (error) => {
      console.error('Failed to track progress:', error)
    },
  })

  // Start tracking when video plays
  const startTracking = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1

          // Auto-save progress every 30 seconds
          if (newTime % 30 === 0) {
            trackProgressMutation.mutate({
              progress_percentage: progress,
              watch_time_seconds: newTime,
              is_completed: false,
            })
          }

          return newTime
        })
      }, 1000)
    }
  }, [progress, trackProgressMutation])

  // Stop tracking when video pauses
  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  // Update progress percentage (called when video time changes)
  const updateProgress = useCallback((progressPercentage: number) => {
    setProgress(progressPercentage)
  }, [])

  // Mark lecture as complete
  const completeLecture = useCallback(() => {
    trackProgressMutation.mutate({
      progress_percentage: 100,
      watch_time_seconds: watchTime,
      is_completed: true,
    })
  }, [watchTime, trackProgressMutation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    watchTime,
    progress,
    startTracking,
    stopTracking,
    updateProgress,
    completeLecture,
    isTracking: trackProgressMutation.isPending,
  }
}

// Notes management hook
export function useStudentNotes(courseId: string, lectureId: string) {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  // Fetch notes for current lecture
  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lecture-notes', courseId, lectureId],
    queryFn: () =>
      token
        ? api.getLectureNotes(token, courseId, lectureId)
        : Promise.reject('No token'),
    enabled: !!token && !!courseId && !!lectureId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (data: { content: string; video_timestamp?: number }) =>
      token
        ? api.createNote(token, {
            course_id: courseId,
            lecture_id: lectureId,
            ...data,
          })
        : Promise.reject('No token'),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lecture-notes', courseId, lectureId],
      })
    },
    onError: (error) => {
      console.error('Failed to create note:', error)
    },
  })

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: (data: { noteId: string; content: string }) =>
      token
        ? api.updateNote(token, data.noteId, data.content)
        : Promise.reject('No token'),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lecture-notes', courseId, lectureId],
      })
    },
    onError: (error) => {
      console.error('Failed to update note:', error)
    },
  })

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) =>
      token ? api.deleteNote(token, noteId) : Promise.reject('No token'),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lecture-notes', courseId, lectureId],
      })
    },
    onError: (error) => {
      console.error('Failed to delete note:', error)
    },
  })

  const notes = notesData?.notes || []

  const addNote = useCallback(
    (content: string, videoTimestamp?: number) => {
      createNoteMutation.mutate({ content, video_timestamp: videoTimestamp })
    },
    [createNoteMutation],
  )

  const updateNote = useCallback(
    (noteId: string, content: string) => {
      updateNoteMutation.mutate({ noteId, content })
    },
    [updateNoteMutation],
  )

  const deleteNote = useCallback(
    (noteId: string) => {
      deleteNoteMutation.mutate(noteId)
    },
    [deleteNoteMutation],
  )

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  }
}

// Course access control hook
export function useCourseAccess(courseId: string) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['course-access', courseId],
    queryFn: () =>
      token
        ? api.checkCourseAccess(token, courseId)
        : Promise.reject('No token'),
    enabled: !!token && !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

// Video streaming hook
export function useVideoStream(lectureId: string, hasAccess: boolean) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['lecture-stream', lectureId],
    queryFn: () =>
      token
        ? api.getLectureStream(token, lectureId)
        : Promise.reject('No token'),
    enabled: !!token && !!lectureId && hasAccess,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

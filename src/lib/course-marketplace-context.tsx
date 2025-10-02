import { createContext, useCallback, useContext, useReducer } from 'react'

import type {
  Course,
  CourseAccess,
  CourseFilter,
  CoursePurchase,
  CourseSearchResult,
} from '@/lib/types'
import type { ReactNode } from 'react'

// State interface
interface CourseMarketplaceState {
  // Search and filtering
  searchResults: CourseSearchResult | null
  activeFilters: CourseFilter
  searchQuery: string
  isSearching: boolean

  // Course access and purchases
  userCourseAccess: Map<string, CourseAccess>
  userPurchases: Array<CoursePurchase>

  // Payment flow state
  paymentFlow: {
    isActive: boolean
    courseId: string | null
    checkoutUrl: string | null
    status: 'idle' | 'initiating' | 'processing' | 'completed' | 'failed'
    error: string | null
  }

  // UI state
  selectedCourse: Course | null
  viewMode: 'grid' | 'list'
  sortBy: CourseFilter['sort_by']

  // Featured and recommendations
  featuredCourses: Array<Course>
  recommendedCourses: Array<Course>

  // Loading states
  loading: {
    search: boolean
    access: boolean
    payment: boolean
    featured: boolean
    recommended: boolean
  }

  // Errors
  errors: {
    search: string | null
    access: string | null
    payment: string | null
    general: string | null
  }
}

// Action types
type CourseMarketplaceAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<CourseFilter> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT_BY'; payload: CourseFilter['sort_by'] }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; payload: CourseSearchResult }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SET_SELECTED_COURSE'; payload: Course | null }
  | { type: 'SET_USER_ACCESS'; payload: Array<CourseAccess> }
  | { type: 'SET_USER_PURCHASES'; payload: Array<CoursePurchase> }
  | { type: 'UPDATE_COURSE_ACCESS'; payload: CourseAccess }
  | { type: 'PAYMENT_START'; payload: string }
  | {
      type: 'PAYMENT_CHECKOUT_CREATED'
      payload: { courseId: string; checkoutUrl: string }
    }
  | {
      type: 'PAYMENT_SUCCESS'
      payload: { courseId: string; purchase: CoursePurchase }
    }
  | { type: 'PAYMENT_ERROR'; payload: string }
  | { type: 'PAYMENT_RESET' }
  | { type: 'SET_FEATURED_COURSES'; payload: Array<Course> }
  | { type: 'SET_RECOMMENDED_COURSES'; payload: Array<Course> }
  | {
      type: 'SET_LOADING'
      payload: { key: keyof CourseMarketplaceState['loading']; value: boolean }
    }
  | {
      type: 'SET_ERROR'
      payload: {
        key: keyof CourseMarketplaceState['errors']
        value: string | null
      }
    }
  | { type: 'CLEAR_ALL_ERRORS' }

// Initial state
const initialState: CourseMarketplaceState = {
  searchResults: null,
  activeFilters: {},
  searchQuery: '',
  isSearching: false,
  userCourseAccess: new Map(),
  userPurchases: [],
  paymentFlow: {
    isActive: false,
    courseId: null,
    checkoutUrl: null,
    status: 'idle',
    error: null,
  },
  selectedCourse: null,
  viewMode: 'grid',
  sortBy: 'popularity',
  featuredCourses: [],
  recommendedCourses: [],
  loading: {
    search: false,
    access: false,
    payment: false,
    featured: false,
    recommended: false,
  },
  errors: {
    search: null,
    access: null,
    payment: null,
    general: null,
  },
}

// Reducer
function courseMarketplaceReducer(
  state: CourseMarketplaceState,
  action: CourseMarketplaceAction,
): CourseMarketplaceState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      }

    case 'SET_FILTERS':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          ...action.payload,
        },
      }

    case 'CLEAR_FILTERS':
      return {
        ...state,
        activeFilters: {},
        searchQuery: '',
      }

    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
        activeFilters: {
          ...state.activeFilters,
          sort_by: action.payload,
        },
      }

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      }

    case 'SEARCH_START':
      return {
        ...state,
        isSearching: true,
        loading: { ...state.loading, search: true },
        errors: { ...state.errors, search: null },
      }

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        searchResults: action.payload,
        isSearching: false,
        loading: { ...state.loading, search: false },
        errors: { ...state.errors, search: null },
      }

    case 'SEARCH_ERROR':
      return {
        ...state,
        isSearching: false,
        loading: { ...state.loading, search: false },
        errors: { ...state.errors, search: action.payload },
      }

    case 'SET_SELECTED_COURSE':
      return {
        ...state,
        selectedCourse: action.payload,
      }

    case 'SET_USER_ACCESS': {
      const accessMap = new Map<string, CourseAccess>()
      action.payload.forEach((access) => {
        accessMap.set(access.course_id, access)
      })
      return {
        ...state,
        userCourseAccess: accessMap,
        loading: { ...state.loading, access: false },
        errors: { ...state.errors, access: null },
      }
    }

    case 'SET_USER_PURCHASES':
      return {
        ...state,
        userPurchases: action.payload,
      }

    case 'UPDATE_COURSE_ACCESS': {
      const newAccessMap = new Map(state.userCourseAccess)
      newAccessMap.set(action.payload.course_id, action.payload)
      return {
        ...state,
        userCourseAccess: newAccessMap,
      }
    }

    case 'PAYMENT_START':
      return {
        ...state,
        paymentFlow: {
          isActive: true,
          courseId: action.payload,
          checkoutUrl: null,
          status: 'initiating',
          error: null,
        },
        loading: { ...state.loading, payment: true },
        errors: { ...state.errors, payment: null },
      }

    case 'PAYMENT_CHECKOUT_CREATED':
      return {
        ...state,
        paymentFlow: {
          ...state.paymentFlow,
          courseId: action.payload.courseId,
          checkoutUrl: action.payload.checkoutUrl,
          status: 'processing',
        },
        loading: { ...state.loading, payment: false },
      }

    case 'PAYMENT_SUCCESS': {
      // Update user access and purchases
      const updatedAccessMap = new Map(state.userCourseAccess)
      updatedAccessMap.set(action.payload.courseId, {
        user_id: action.payload.purchase.user_id,
        course_id: action.payload.courseId,
        access_level: 'full',
        purchase_id: action.payload.purchase.id,
        granted_at: action.payload.purchase.purchased_at,
      })

      return {
        ...state,
        paymentFlow: {
          isActive: false,
          courseId: null,
          checkoutUrl: null,
          status: 'completed',
          error: null,
        },
        userCourseAccess: updatedAccessMap,
        userPurchases: [...state.userPurchases, action.payload.purchase],
        loading: { ...state.loading, payment: false },
        errors: { ...state.errors, payment: null },
      }
    }

    case 'PAYMENT_ERROR':
      return {
        ...state,
        paymentFlow: {
          ...state.paymentFlow,
          status: 'failed',
          error: action.payload,
        },
        loading: { ...state.loading, payment: false },
        errors: { ...state.errors, payment: action.payload },
      }

    case 'PAYMENT_RESET':
      return {
        ...state,
        paymentFlow: {
          isActive: false,
          courseId: null,
          checkoutUrl: null,
          status: 'idle',
          error: null,
        },
        errors: { ...state.errors, payment: null },
      }

    case 'SET_FEATURED_COURSES':
      return {
        ...state,
        featuredCourses: action.payload,
        loading: { ...state.loading, featured: false },
      }

    case 'SET_RECOMMENDED_COURSES':
      return {
        ...state,
        recommendedCourses: action.payload,
        loading: { ...state.loading, recommended: false },
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      }

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
      }

    case 'CLEAR_ALL_ERRORS':
      return {
        ...state,
        errors: {
          search: null,
          access: null,
          payment: null,
          general: null,
        },
      }

    default:
      return state
  }
}

// Context
const CourseMarketplaceContext = createContext<{
  state: CourseMarketplaceState
  dispatch: React.Dispatch<CourseMarketplaceAction>
} | null>(null)

// Provider component
interface CourseMarketplaceProviderProps {
  children: ReactNode
}

export function CourseMarketplaceProvider({
  children,
}: CourseMarketplaceProviderProps) {
  const [state, dispatch] = useReducer(courseMarketplaceReducer, initialState)

  return (
    <CourseMarketplaceContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseMarketplaceContext.Provider>
  )
}

// Hook for using the context
export function useCourseMarketplace() {
  const context = useContext(CourseMarketplaceContext)
  if (!context) {
    throw new Error(
      'useCourseMarketplace must be used within CourseMarketplaceProvider',
    )
  }
  return context
}

// Hook for course access utilities
export function useCourseAccess() {
  const { state, dispatch } = useCourseMarketplace()

  const getCourseAccess = useCallback(
    (courseId: string): CourseAccess | null => {
      return state.userCourseAccess.get(courseId) || null
    },
    [state.userCourseAccess],
  )

  const hasFullAccess = useCallback(
    (courseId: string): boolean => {
      const access = getCourseAccess(courseId)
      return access?.access_level === 'full'
    },
    [getCourseAccess],
  )

  const hasPreviewAccess = useCallback(
    (courseId: string): boolean => {
      const access = getCourseAccess(courseId)
      return (
        access?.access_level === 'preview' || access?.access_level === 'full'
      )
    },
    [getCourseAccess],
  )

  const canAccessCourse = useCallback(
    (course: Course): boolean => {
      if (course.is_free || course.access_type === 'free') {
        return true
      }
      return hasFullAccess(course.id)
    },
    [hasFullAccess],
  )

  const getAccessStatus = useCallback(
    (course: Course): 'free' | 'preview' | 'purchased' | 'locked' => {
      if (course.is_free || course.access_type === 'free') {
        return 'free'
      }

      const access = getCourseAccess(course.id)
      if (!access) {
        return 'locked'
      }

      if (access.access_level === 'full') {
        return 'purchased'
      }

      if (access.access_level === 'preview') {
        return 'preview'
      }

      return 'locked'
    },
    [getCourseAccess],
  )

  const isPurchased = useCallback(
    (courseId: string): boolean => {
      return state.userPurchases.some(
        (purchase) =>
          purchase.course_id === courseId && purchase.status === 'completed',
      )
    },
    [state.userPurchases],
  )

  return {
    getCourseAccess,
    hasFullAccess,
    hasPreviewAccess,
    canAccessCourse,
    getAccessStatus,
    isPurchased,
    dispatch,
  }
}

// Hook for payment flow utilities
export function usePaymentFlow() {
  const { state, dispatch } = useCourseMarketplace()

  const startPayment = useCallback(
    (courseId: string) => {
      dispatch({ type: 'PAYMENT_START', payload: courseId })
    },
    [dispatch],
  )

  const setCheckoutUrl = useCallback(
    (courseId: string, checkoutUrl: string) => {
      dispatch({
        type: 'PAYMENT_CHECKOUT_CREATED',
        payload: { courseId, checkoutUrl },
      })
    },
    [dispatch],
  )

  const completePayment = useCallback(
    (courseId: string, purchase: CoursePurchase) => {
      dispatch({
        type: 'PAYMENT_SUCCESS',
        payload: { courseId, purchase },
      })
    },
    [dispatch],
  )

  const failPayment = useCallback(
    (error: string) => {
      dispatch({ type: 'PAYMENT_ERROR', payload: error })
    },
    [dispatch],
  )

  const resetPayment = useCallback(() => {
    dispatch({ type: 'PAYMENT_RESET' })
  }, [dispatch])

  return {
    paymentFlow: state.paymentFlow,
    startPayment,
    setCheckoutUrl,
    completePayment,
    failPayment,
    resetPayment,
  }
}

export default CourseMarketplaceContext

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

// UI Components
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoUploadStep } from './wizard-steps/VideoUploadStep'
import { ResourceManagementStep } from './wizard-steps/ResourceManagementStep'
import { LectureManagementStep } from './wizard-steps/LectureManagementStep'
import { CourseSettingsStep } from './wizard-steps/CourseSettingsStep'
import { CourseDetailsStep } from './wizard-steps/CourseDetailsStep'
import { BasicInfoStep } from './wizard-steps/BasicInfoStep'
import type {
  CourseCreationData,
  CourseResource,
  LectureCreationData,
  WizardStep,
} from '@/lib/course-management-types'

// Complete Course Creation Schema
const courseCreationSchema = z.object({
  // Basic Info (Step 1)
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  category: z.string().min(1, 'Please select a category'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  price: z.number().min(0).max(10000000),
  currency: z.enum(['VND', 'USD']),
  thumbnail_url: z.string().optional(),

  // Course Details (Step 2)
  learning_outcomes: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  language: z.string().min(1, 'Please select a language'),
  tags: z.array(z.string()).default([]),
  estimated_duration_hours: z.number().min(0).max(1000),

  // Course Settings (Step 3)
  status: z.enum(['draft', 'published', 'under_review']).default('draft'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  max_students: z.number().optional(),
  auto_approve_enrollment: z.boolean().default(true),
  allow_previews: z.boolean().default(true),
  has_certificate: z.boolean().default(false),
  mobile_access: z.boolean().default(true),

  // Additional fields for other steps
  lectures: z.array(z.any()).default([]),
  resources: z.array(z.any()).default([]),
  videos: z.array(z.any()).optional(),
})

type CourseFormData = z.infer<typeof courseCreationSchema>

interface CourseCreationWizardProps {
  editingCourse?: Partial<CourseCreationData> & { id?: string }
}

export function CourseCreationWizard({
  editingCourse,
}: CourseCreationWizardProps) {
  const router = useRouter()
  const { user, token } = useAuth()
  const queryClient = useQueryClient()

  // React Hook Form setup
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseCreationSchema) as any,
    defaultValues: {
      title: editingCourse?.title ?? '',
      description: editingCourse?.description ?? '',
      category: editingCourse?.category ?? '',
      difficulty_level: editingCourse?.difficulty_level ?? 'beginner',
      price: typeof editingCourse?.price === 'number' ? editingCourse.price : 0,
      currency: editingCourse?.currency ?? 'VND',
      thumbnail_url: editingCourse?.thumbnail_url ?? '',
      learning_outcomes: editingCourse?.learning_outcomes ?? [],
      requirements: editingCourse?.requirements ?? [],
      language: editingCourse?.language ?? 'vi',
      tags: editingCourse?.tags ?? [],
      estimated_duration_hours:
        typeof editingCourse?.estimated_duration_hours === 'number'
          ? editingCourse.estimated_duration_hours
          : 10,
      status: editingCourse?.status ?? 'draft',
      auto_approve_enrollment: editingCourse?.auto_approve_enrollment ?? true,
      allow_previews: editingCourse?.allow_previews ?? true,
      has_certificate: editingCourse?.has_certificate ?? false,
      mobile_access: editingCourse?.mobile_access ?? true,
      lectures: editingCourse?.lectures ?? [],
      resources: editingCourse?.resources ?? [],
      videos: editingCourse?.videos ?? [],
      ...(editingCourse?.start_date && {
        start_date: editingCourse.start_date,
      }),
      ...(editingCourse?.end_date && { end_date: editingCourse.end_date }),
      ...(editingCourse?.max_students && {
        max_students: editingCourse.max_students,
      }),
    },
    mode: 'onChange',
  })

  // Wizard State
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepErrors, setStepErrors] = useState<Record<number, Array<string>>>(
    {},
  )

  // Auto-save functionality (only for new courses)
  const debouncedSave = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (data: CourseFormData) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (user?.id != null && !editingCourse) {
          try {
            localStorage.setItem(
              `course-draft-${user.id}`,
              JSON.stringify(data),
            )
          } catch (error) {
            console.error('Auto-save failed:', error)
          }
        }
      }, 2000)
    }
  }, [user?.id, editingCourse])

  // Watch form changes for auto-save
  const watchedFormData = form.watch()
  useEffect(() => {
    debouncedSave(watchedFormData)
  }, [watchedFormData, debouncedSave])

  // Load saved draft on component mount (only if not editing)
  useEffect(() => {
    if (user?.id != null && editingCourse == null) {
      try {
        const savedDraft = localStorage.getItem(`course-draft-${user.id}`)
        if (savedDraft != null && savedDraft.length > 0) {
          const draftData = courseCreationSchema.parse(JSON.parse(savedDraft))
          form.reset(draftData)
        }
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }
  }, [user?.id, editingCourse, form])

  // Clear draft when switching to edit mode
  useEffect(() => {
    if (editingCourse && user?.id) {
      localStorage.removeItem(`course-draft-${user.id}`)
    }
  }, [editingCourse, user?.id])

  // Define wizard steps with proper component typing
  const steps: Array<WizardStep & { component: React.ComponentType<any> }> = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Course title, description, and category',
      component: BasicInfoStep,
      isComplete: false,
      isActive: currentStep === 0,
    },
    {
      id: 'course-details',
      title: 'Course Details',
      description: 'Learning objectives and prerequisites',
      component: CourseDetailsStep,
      isComplete: false,
      isActive: currentStep === 1,
    },
    {
      id: 'course-settings',
      title: 'Course Settings',
      description: 'Publication and enrollment settings',
      component: CourseSettingsStep,
      isComplete: false,
      isActive: currentStep === 2,
    },
    {
      id: 'lectures',
      title: 'Add Lectures',
      description: 'Create and organize course content',
      component: LectureManagementStep,
      isComplete: false,
      isActive: currentStep === 3,
    },
    {
      id: 'resources',
      title: 'Add Resources',
      description: 'Upload supplementary materials',
      component: ResourceManagementStep,
      isComplete: false,
      isActive: currentStep === 4,
    },
    {
      id: 'videos',
      title: 'Video Upload',
      description: 'Upload and assign course videos',
      component: VideoUploadStep,
      isComplete: false,
      isActive: currentStep === 5,
    },
  ]

  // Course Creation/Update Mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseCreationData) => {
      if (token == null || user?.id == null) {
        throw new Error('Authentication required')
      }

      const courseData = {
        title: data.title,
        description: data.description,
        instructor_id: user.id,
        category: data.category,
        level: data.difficulty_level,
        price: data.price,
        currency: data.currency,
        status: data.status,
        difficulty_level: data.difficulty_level,
        language: data.language,
        thumbnail_url: data.thumbnail_url,
        // Convert arrays to JSON strings for backend
        learning_outcomes: data.learning_outcomes,
        requirements: data.requirements,
        tags: data.tags,
        estimated_duration_hours: data.estimated_duration_hours,
        auto_approve_enrollment: data.auto_approve_enrollment,
        allow_previews: data.allow_previews,
        has_certificate: data.has_certificate,
        mobile_access: data.mobile_access,
        start_date: data.start_date,
        end_date: data.end_date,
        max_students: data.max_students,
        // Include lectures data
        lectures: data.lectures || [],
        resources: data.resources || [],
      }

      // Use update if editing, create if new
      if (editingCourse?.id) {
        return api.updateCourse(token, editingCourse.id, courseData)
      } else {
        return api.createCourse(token, courseData)
      }
    },
    onSuccess: (response) => {
      // Clear saved draft
      if (user?.id != null) {
        localStorage.removeItem(`course-draft-${user.id}`)
      }

      // Invalidate courses query
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] })

      toast.success(
        editingCourse
          ? 'Course updated successfully!'
          : 'Course created successfully!',
      )

      // Navigate to course management
      router.navigate({
        to: '/dashboard/instructor/courses',
        search: editingCourse
          ? { updated: response.data?.id }
          : { created: response.data?.id },
      })
    },
    onError: (error: Error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${editingCourse ? 'update' : 'create'} course`
      toast.error(errorMessage)
      setIsSubmitting(false)
    },
  })

  // Update form data
  const updateFormData = (stepData: Partial<CourseCreationData>) => {
    Object.keys(stepData).forEach((key) => {
      const fieldName = key as keyof CourseFormData
      const value = stepData[fieldName as keyof CourseCreationData]
      if (value !== undefined) {
        form.setValue(fieldName, value)
      }
    })
  }

  // Validate current step using React Hook Form
  const validateCurrentStep = async () => {
    const result = await form.trigger()
    if (!result) {
      const errors = form.formState.errors
      const currentStepErrors = Object.values(errors)
        .filter(Boolean)
        .map((error) => error.message ?? 'Validation error')

      setStepErrors((prev) => ({
        ...prev,
        [currentStep]: currentStepErrors,
      }))
      return false
    }
    return true
  }

  // Navigation handlers
  const nextStep = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
      setStepErrors((prev) => ({ ...prev, [currentStep]: [] }))
    }
  }

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
    setStepErrors((prev) => ({ ...prev, [currentStep]: [] }))
  }

  const goToStep = async (stepIndex: number) => {
    if (stepIndex <= currentStep || (await validateCurrentStep())) {
      setCurrentStep(stepIndex)
      setStepErrors({})
    }
  }

  // Save as draft
  const saveDraft = async () => {
    if (token == null || user?.id == null) {
      toast.error('Authentication required')
      return
    }

    try {
      const formData = form.getValues()
      const draftData: CourseCreationData = {
        // Required fields with defaults
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty_level: formData.difficulty_level,
        price: formData.price,
        currency: formData.currency,
        language: formData.language,
        thumbnail_url: formData.thumbnail_url,
        learning_outcomes: formData.learning_outcomes,
        requirements: formData.requirements,
        tags: formData.tags,
        estimated_duration_hours: formData.estimated_duration_hours,
        status: formData.status,
        auto_approve_enrollment: formData.auto_approve_enrollment,
        allow_previews: formData.allow_previews,
        has_certificate: formData.has_certificate,
        mobile_access: formData.mobile_access,
        lectures: formData.lectures as Array<LectureCreationData>,
        resources: formData.resources as Array<CourseResource>,
        videos: [],
        // Optional fields
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_students: formData.max_students,
      }

      await createCourseMutation.mutateAsync(draftData)
    } catch (error) {
      // Error handled by mutation
    }
  }

  // Publish course
  const publishCourse = async () => {
    // Validate the form
    const isValid = await form.trigger()
    if (!isValid) {
      toast.error('Please complete all required fields before publishing')
      return
    }

    if (token == null || user?.id == null) {
      toast.error('Authentication required')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = form.getValues()
      const courseData: CourseCreationData = {
        // Required fields
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty_level: formData.difficulty_level,
        price: formData.price,
        currency: formData.currency,
        language: formData.language,
        thumbnail_url: formData.thumbnail_url,
        learning_outcomes: formData.learning_outcomes,
        requirements: formData.requirements,
        tags: formData.tags,
        estimated_duration_hours: formData.estimated_duration_hours,
        status: 'published' as const,
        auto_approve_enrollment: formData.auto_approve_enrollment,
        allow_previews: formData.allow_previews,
        has_certificate: formData.has_certificate,
        mobile_access: formData.mobile_access,
        lectures: formData.lectures as Array<LectureCreationData>,
        resources: formData.resources as Array<CourseResource>,
        videos: [],
        // Optional fields
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_students: formData.max_students,
      }

      await createCourseMutation.mutateAsync(courseData)
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false)
    }
  }

  // Current step component with bounds checking
  const CurrentStepComponent = steps[currentStep]?.component ?? null

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="border-b p-6 bg-background">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-semibold tracking-tight">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow the steps below to create and publish your course
            </p>

            {/* Progress Indicator */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span>
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  Complete
                </span>
              </div>
              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="mx-auto max-w-7xl w-full flex">
            {/* Step Navigation Sidebar */}
            <div className="w-80 border-r bg-muted/30 p-6">
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      'group cursor-pointer rounded-lg p-4 transition-all',
                      step.isActive &&
                        'bg-background border border-primary/20 shadow-sm',
                      step.isComplete && 'bg-green-50 border border-green-200',
                      !step.isActive &&
                        !step.isComplete &&
                        'hover:bg-background/50',
                      index > currentStep && 'opacity-60 cursor-not-allowed',
                    )}
                    onClick={() => index <= currentStep && goToStep(index)}
                  >
                    <div className="flex items-start gap-3">
                      <Badge
                        variant={
                          step.isComplete
                            ? 'default'
                            : step.isActive
                              ? 'outline'
                              : 'secondary'
                        }
                        className="mt-0.5 h-7 w-7 rounded-full p-0 flex items-center justify-center text-xs font-medium"
                      >
                        {step.isComplete ? '✓' : index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {step.description}
                        </p>
                        {stepErrors[index]?.length ? (
                          <p className="text-xs text-destructive mt-1">
                            {stepErrors[index][0]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="h-full p-6">
                <FormProvider {...form}>
                  <CurrentStepComponent
                    formData={form.getValues()}
                    onUpdate={updateFormData}
                    errors={stepErrors[currentStep] ?? []}
                    onNext={nextStep}
                  />
                </FormProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t p-6 flex-shrink-0 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isSubmitting}
                >
                  Save Draft
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button onClick={publishCourse} disabled={isSubmitting}>
                    {isSubmitting
                      ? editingCourse
                        ? 'Updating...'
                        : 'Publishing...'
                      : editingCourse
                        ? 'Update Course'
                        : 'Publish Course'}
                  </Button>
                ) : (
                  <Button onClick={nextStep}>Continue</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

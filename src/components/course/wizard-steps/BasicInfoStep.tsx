import { Controller, useFormContext } from 'react-hook-form'

// UI Components
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThumbnailUpload } from '../ThumbnailUpload'
import type { CourseCreationData } from '@/lib/course-management-types'

// Types
type BasicInfoStepProps = {
  formData: Partial<CourseCreationData>
  onUpdate: (data: Partial<CourseCreationData>) => void
  errors: Array<string>
  onNext?: () => void
}

const categories = [
  { value: 'programming', label: 'Programming & Development' },
  { value: 'design', label: 'Design & Creative' },
  { value: 'business', label: 'Business & Entrepreneurship' },
  { value: 'marketing', label: 'Marketing & Sales' },
  { value: 'data-science', label: 'Data Science & Analytics' },
  { value: 'language', label: 'Language Learning' },
  { value: 'music', label: 'Music & Audio' },
  { value: 'photography', label: 'Photography & Video' },
  { value: 'fitness', label: 'Health & Fitness' },
  { value: 'personal-development', label: 'Personal Development' },
]

const difficultyLevels = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'No prior experience required',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Some basic knowledge helpful',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Solid foundation required',
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Extensive experience needed',
  },
]

export function BasicInfoStep({ onUpdate, errors }: BasicInfoStepProps) {
  const {
    control,
    watch,
    formState: { errors: formErrors },
  } = useFormContext<CourseCreationData>()

  // Watch form values for UI feedback
  const watchedPrice = watch('price')

  // Check if all required fields are completed
  const isFormValid = () => {
    const title = watch('title')
    const description = watch('description')
    const category = watch('category')

    return !!(
      title &&
      title.length >= 3 &&
      description &&
      description.length >= 10 &&
      category
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Basic Course Information
        </h2>
        <p className="text-muted-foreground mt-2">
          Let&apos;s start with the essential details about your course that
          will be visible to students.
        </p>
      </div>

      {/* Form Content */}
      <div>
        <div className="space-y-6 max-w-4xl pb-4">
          {/* Course Identity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Course Identity
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              </CardTitle>
              <CardDescription>
                These details will be prominently displayed to students browsing
                courses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Title */}
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Title must be less than 100 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Course Title *
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="e.g., Complete React Development Course"
                          value={field.value || ''}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            onUpdate({ title: e.target.value })
                          }}
                          onBlur={field.onBlur}
                          className="text-base"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Make it descriptive and engaging</span>
                          <span>{(field.value || '').length}/100</span>
                        </div>
                      </div>
                    </FormControl>
                    {formErrors.title && (
                      <FormMessage>{formErrors.title.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Course Description */}
              <Controller
                name="description"
                control={control}
                rules={{
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                  maxLength: {
                    value: 2000,
                    message: 'Description too long',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Course Description *
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Provide a compelling description of your course. What will students learn? What makes it unique? What problems does it solve?"
                          className="min-h-32 resize-none text-base"
                          value={field.value || ''}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            onUpdate({ description: e.target.value })
                          }}
                          onBlur={field.onBlur}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Be specific about what students will gain</span>
                          <span>{(field.value || '').length}/2000</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      A good description helps students understand if this
                      course is right for them
                    </FormDescription>
                    {formErrors.description && (
                      <FormMessage>
                        {formErrors.description.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Category and Difficulty */}
              <div className="grid md:grid-cols-2 gap-6">
                <Controller
                  name="category"
                  control={control}
                  rules={{
                    required: 'Please select a category',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Category *
                      </FormLabel>
                      <Select
                        value={field.value || ''}
                        onValueChange={(value) => {
                          field.onChange(value)
                          onUpdate({ category: value })
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the most relevant category for better
                        discoverability
                      </FormDescription>
                      {formErrors.category && (
                        <FormMessage>{formErrors.category.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <Controller
                  name="difficulty_level"
                  control={control}
                  rules={{
                    required: 'Please select a difficulty level',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Difficulty Level *
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(
                            value as CourseCreationData['difficulty_level'],
                          )
                          onUpdate({
                            difficulty_level:
                              value as CourseCreationData['difficulty_level'],
                          })
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">
                                  {level.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {level.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.difficulty_level && (
                        <FormMessage>
                          {formErrors.difficulty_level.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Controller
            name="thumbnail_url"
            control={control}
            render={({ field }) => (
              <ThumbnailUpload
                value={field.value || ''}
                onChange={(url) => {
                  field.onChange(url)
                  onUpdate({ thumbnail_url: url })
                }}
                onError={(error) => {
                  console.error('Thumbnail upload error:', error)
                }}
              />
            )}
          />

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Pricing</CardTitle>
              <CardDescription>
                Set your course pricing. You can always change this later in
                your course settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const num = Number(value)
                      if (isNaN(num)) return 'Price must be a valid number'
                      if (num < 0) return 'Price cannot be negative'
                      if (num > 10000000) return 'Price is too high'
                      return true
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="1000"
                            value={field.value ?? 0}
                            onChange={(e) => {
                              const value =
                                e.target.value === ''
                                  ? 0
                                  : parseInt(e.target.value, 10)
                              const numericValue = isNaN(value) ? 0 : value
                              field.onChange(numericValue)
                              onUpdate({ price: numericValue })
                            }}
                            onBlur={field.onBlur}
                            className="text-base"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter 0 for a free course
                      </FormDescription>
                      {formErrors.price && (
                        <FormMessage>{formErrors.price.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Currency
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(
                            value as CourseCreationData['currency'],
                          )
                          onUpdate({
                            currency: value as CourseCreationData['currency'],
                          })
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VND">
                            Vietnamese Dong (VND)
                          </SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.currency && (
                        <FormMessage>{formErrors.currency.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing Feedback */}
              {watchedPrice === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-xs">💡</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Free Course Benefits
                      </h4>
                      <p className="text-sm text-blue-800">
                        Free courses can help you build your reputation, gather
                        reviews, and attract students to your paid courses.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {watchedPrice > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-xs">💰</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-900 mb-1">
                        Pricing Suggestion
                      </h4>
                      <p className="text-sm text-green-800">
                        Consider your course content depth, your expertise
                        level, and market research when setting prices.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {errors.length > 0 && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-sm text-destructive space-y-1">
                  {errors.map((error, index) => (
                    <p key={index}>• {error}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Form Status Indicator */}
      <div className="pt-4 border-t bg-background">
        <div className="text-sm text-muted-foreground">
          {isFormValid() ? (
            <span className="text-green-600 flex items-center gap-1">
              <span className="text-green-500">✓</span>
              All required fields completed
            </span>
          ) : (
            <span>Please complete all required fields to continue</span>
          )}
        </div>
      </div>
    </div>
  )
}

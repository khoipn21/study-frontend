import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Check, Plus, X } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
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
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { CourseCreationData } from '@/lib/course-management-types'

// Types

interface CourseDetailsStepProps {
  formData: Partial<CourseCreationData>
  onUpdate: (data: Partial<CourseCreationData>) => void
  errors: Array<string>
  onNext?: () => void
}

const languages = [
  { value: 'vi', label: 'Vietnamese' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
]

const commonTags = [
  'web development',
  'mobile app',
  'react',
  'javascript',
  'python',
  'machine learning',
  'ui/ux design',
  'business strategy',
  'digital marketing',
  'photography',
  'video editing',
  'data analysis',
  'blockchain',
  'ai',
]

const suggestedOutcomes = [
  'Build real-world projects from scratch',
  'Master industry-standard tools and technologies',
  'Develop problem-solving skills',
  'Create a professional portfolio',
  'Understand best practices and patterns',
  'Gain confidence in [specific skill]',
  'Learn to debug and troubleshoot effectively',
  'Apply knowledge to practical scenarios',
]

const commonRequirements = [
  'No prior experience needed',
  'Basic computer skills',
  'Access to a computer with internet',
  'Familiarity with [specific tool/language]',
  'High school level mathematics',
  'Previous experience with [related topic]',
  'Willingness to learn and practice',
  'Basic understanding of [concept]',
]

export function CourseDetailsStep({
  formData,
  onUpdate,
  errors,
}: CourseDetailsStepProps) {
  const [newOutcome, setNewOutcome] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newTag, setNewTag] = useState('')

  const {
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useFormContext<CourseCreationData>()

  // Watch form values
  const watchedOutcomes = watch('learning_outcomes')
  const watchedRequirements = watch('requirements')
  const watchedTags = watch('tags')

  // Learning Outcomes Management
  const addLearningOutcome = (outcome: string) => {
    if (outcome.trim() && !watchedOutcomes.includes(outcome.trim())) {
      const newOutcomes = [...watchedOutcomes, outcome.trim()]
      setValue('learning_outcomes', newOutcomes)
      onUpdate({ learning_outcomes: newOutcomes })
      setNewOutcome('')
    }
  }

  const removeLearningOutcome = (index: number) => {
    const newOutcomes = watchedOutcomes.filter((_, i) => i !== index)
    setValue('learning_outcomes', newOutcomes)
    onUpdate({ learning_outcomes: newOutcomes })
  }

  // Requirements Management
  const addRequirement = (requirement: string) => {
    if (
      requirement.trim() &&
      !watchedRequirements.includes(requirement.trim())
    ) {
      const newRequirements = [...watchedRequirements, requirement.trim()]
      setValue('requirements', newRequirements)
      onUpdate({ requirements: newRequirements })
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    const newRequirements = watchedRequirements.filter((_, i) => i !== index)
    setValue('requirements', newRequirements)
    onUpdate({ requirements: newRequirements })
  }

  // Tags Management
  const addTag = (tag: string) => {
    if (
      tag.trim() &&
      !watchedTags.includes(tag.trim()) &&
      watchedTags.length < 10
    ) {
      const newTags = [...watchedTags, tag.trim()]
      setValue('tags', newTags)
      onUpdate({ tags: newTags })
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    const newTags = watchedTags.filter((_, i) => i !== index)
    setValue('tags', newTags)
    onUpdate({ tags: newTags })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Course Details
        </h2>
        <p className="text-muted-foreground mt-2">
          Define what students will learn and what they need to know before
          starting.
        </p>
      </div>

      <div className="space-y-6">
        {/* Learning Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Learning Outcomes
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            </CardTitle>
            <CardDescription>
              What specific skills or knowledge will students gain from this
              course?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Outcomes */}
            {watchedOutcomes.length > 0 && (
              <div className="space-y-2">
                {watchedOutcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="flex-1 text-sm">{outcome}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLearningOutcome(index)}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Outcome */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Build responsive web applications with React"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addLearningOutcome(newOutcome)
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() => addLearningOutcome(newOutcome)}
                  disabled={!newOutcome.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Suggested Outcomes */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedOutcomes.slice(0, 4).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addLearningOutcome(suggestion)}
                      className="text-xs h-7"
                      disabled={watchedOutcomes.includes(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {watchedOutcomes.length === 0 && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                Add at least one learning outcome to help students understand
                what they&apos;ll achieve.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>
              What should students know or have before taking this course?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Requirements */}
            {watchedRequirements.length > 0 && (
              <div className="space-y-2">
                {watchedRequirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span className="flex-1 text-sm">{requirement}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Requirement */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Basic HTML and CSS knowledge"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRequirement(newRequirement)
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() => addRequirement(newRequirement)}
                  disabled={!newRequirement.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Suggested Requirements */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Common requirements:
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonRequirements.slice(0, 4).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addRequirement(suggestion)}
                      className="text-xs h-7"
                      disabled={watchedRequirements.includes(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {watchedRequirements.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  If there are no prerequisites, consider adding &quot;No prior
                  experience needed&quot; to reassure beginners.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Help students find your course with the right language, tags, and
              duration estimate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Language */}
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Language</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        onUpdate({ language: value })
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Primary language for course content and instruction
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Estimated Duration */}
              <Controller
                name="estimated_duration_hours"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (Hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={field.value}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0
                          field.onChange(value)
                          onUpdate({ estimated_duration_hours: value })
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Total time students should expect to spend
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div>
              <FormLabel className="text-sm font-medium mb-3 block">
                Course Tags
                <span className="text-xs text-muted-foreground ml-2">
                  ({watchedTags.length}/10)
                </span>
              </FormLabel>

              {/* Existing Tags */}
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {watchedTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeTag(index)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add New Tag */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., react, javascript, web development"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag(newTag)
                      }
                    }}
                    className="flex-1"
                    disabled={watchedTags.length >= 10}
                  />
                  <Button
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim() || watchedTags.length >= 10}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Suggested Tags */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Popular tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {commonTags
                      .filter((tag) => !watchedTags.includes(tag))
                      .slice(0, 6)
                      .map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => addTag(suggestion)}
                          className="text-xs h-7"
                          disabled={watchedTags.length >= 10}
                        >
                          {suggestion}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>

              <FormDescription>
                Tags help students discover your course. Use relevant keywords
                and technologies.
              </FormDescription>
            </div>
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
  )
}

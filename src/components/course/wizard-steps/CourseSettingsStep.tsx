import { Award, Shield, Users } from 'lucide-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

// UI Components
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

import type { CourseCreationData } from '@/lib/course-management-types'

// Types

interface CourseSettingsStepProps {
  formData: Partial<CourseCreationData>
  onUpdate: (data: Partial<CourseCreationData>) => void
  errors: Array<string>
  onNext?: () => void
}

export function CourseSettingsStep({
  onUpdate,
  errors,
}: CourseSettingsStepProps) {
  const { control, watch, setValue } = useFormContext<CourseCreationData>()

  // Watch form values
  const watchedStatus = watch('status')
  const watchedAutoApprove = watch('auto_approve_enrollment')
  const watchedAllowPreviews = watch('allow_previews')
  const watchedHasCertificate = watch('has_certificate')
  const watchedMobileAccess = watch('mobile_access')
  const watchedMaxStudents = watch('max_students')

  const [schedulePublish, setSchedulePublish] = useState(
    Boolean(watch('start_date')),
  )

  const updateField = (field: keyof CourseCreationData, value: any) => {
    setValue(field, value)
    onUpdate({ [field]: value } as Partial<CourseCreationData>)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Course Settings
        </h2>
        <p className="text-muted-foreground mt-2">
          Configure how your course will be published and who can access it.
        </p>
      </div>

      <div className="space-y-6">
        {/* Publication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Publication Settings
            </CardTitle>
            <CardDescription>
              Control when and how your course becomes available to students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Status */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Course Status
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        updateField('status', value)
                      }}
                      className="grid gap-4"
                    >
                      <div className="flex items-start space-x-3 space-y-0">
                        <RadioGroupItem
                          value="draft"
                          id="draft"
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="draft" className="font-medium">
                            Save as Draft
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Course won&apos;t be visible to students. You can
                            edit and publish later.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 space-y-0">
                        <RadioGroupItem
                          value="published"
                          id="published"
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="published" className="font-medium">
                            Publish Immediately
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Course will be available to students right away.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Schedule Publishing */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schedule"
                  checked={schedulePublish}
                  onCheckedChange={(checked) => {
                    setSchedulePublish(Boolean(checked))
                    if (checked === false) {
                      updateField('start_date', '')
                      updateField('end_date', '')
                    }
                  }}
                />
                <Label htmlFor="schedule" className="font-medium">
                  Schedule publication dates
                </Label>
              </div>

              {schedulePublish && (
                <div className="grid md:grid-cols-2 gap-4 pl-6">
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value && field.value !== ''
                                ? new Date(field.value)
                                : undefined
                            }
                            onDateChange={(date) => {
                              const dateString = date
                                ? date.toISOString().split('T')[0]
                                : ''
                              field.onChange(dateString)
                              updateField('start_date', dateString)
                            }}
                            placeholder="Select start date"
                          />
                        </FormControl>
                        <FormDescription>
                          When the course becomes available
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value && field.value !== ''
                                ? new Date(field.value)
                                : undefined
                            }
                            onDateChange={(date) => {
                              const dateString = date
                                ? date.toISOString().split('T')[0]
                                : ''
                              field.onChange(dateString)
                              updateField('end_date', dateString)
                            }}
                            placeholder="Select end date"
                          />
                        </FormControl>
                        <FormDescription>
                          When enrollment closes (optional)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Publication Status Info */}
            {watchedStatus === 'published' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-900 mb-1">
                      Ready to Publish
                    </h4>
                    <p className="text-sm text-green-800">
                      Your course will be live and available to students
                      immediately after creation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrollment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Enrollment Settings
            </CardTitle>
            <CardDescription>
              Configure how students can enroll in your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Maximum Students */}
            <Controller
              name="max_students"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Students (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="No limit"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value)
                          : undefined
                        field.onChange(value)
                        updateField('max_students', value)
                      }}
                      className="max-w-xs"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for unlimited enrollment
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Auto-approve Enrollment */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Auto-approve Enrollment
                </Label>
                <p className="text-sm text-muted-foreground">
                  Students can enroll immediately without waiting for approval
                </p>
              </div>
              <Switch
                checked={watchedAutoApprove}
                onCheckedChange={(checked) =>
                  updateField('auto_approve_enrollment', checked)
                }
              />
            </div>

            {/* Allow Previews */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Allow Course Previews
                </Label>
                <p className="text-sm text-muted-foreground">
                  Let non-enrolled students preview some lectures
                </p>
              </div>
              <Switch
                checked={watchedAllowPreviews}
                onCheckedChange={(checked) =>
                  updateField('allow_previews', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Course Features
            </CardTitle>
            <CardDescription>
              Additional features and benefits for your students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Certificate */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">
                    Certificate of Completion
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Popular
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Award students a certificate when they complete the course
                </p>
              </div>
              <Switch
                checked={watchedHasCertificate}
                onCheckedChange={(checked) =>
                  updateField('has_certificate', checked)
                }
              />
            </div>

            {/* Mobile Access */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Mobile Access</Label>
                <p className="text-sm text-muted-foreground">
                  Course content optimized for mobile devices
                </p>
              </div>
              <Switch
                checked={watchedMobileAccess}
                onCheckedChange={(checked) =>
                  updateField('mobile_access', checked)
                }
              />
            </div>

            {/* Feature Benefits */}
            <div className="grid md:grid-cols-2 gap-4">
              {watchedHasCertificate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Certificate Benefits
                      </h4>
                      <p className="text-sm text-blue-800">
                        Increases course value and completion rates by 40%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {watchedMobileAccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-xs">📱</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-900 mb-1">
                        Mobile Learning
                      </h4>
                      <p className="text-sm text-green-800">
                        60% of students prefer learning on mobile devices
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publication:</span>
                  <Badge
                    variant={
                      watchedStatus === 'published' ? 'default' : 'secondary'
                    }
                  >
                    {watchedStatus === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enrollment:</span>
                  <span>
                    {watchedAutoApprove ? 'Auto-approve' : 'Manual approval'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Students:</span>
                  <span>{watchedMaxStudents ?? 'Unlimited'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate:</span>
                  <span>{watchedHasCertificate ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile Access:</span>
                  <span>{watchedMobileAccess ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Previews:</span>
                  <span>{watchedAllowPreviews ? 'Allowed' : 'Disabled'}</span>
                </div>
              </div>
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

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { RichTextEditorRef } from '@/components/ui/rich-text-editor'

const createTopicSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    .max(200, 'Tiêu đề không được quá 200 ký tự'),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  courseId: z.string().optional(),
  tags: z.array(z.string()).max(5, 'Tối đa 5 thẻ tag'),
})

type CreateTopicFormData = z.infer<typeof createTopicSchema>

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateTopicFormData & { content: string }) => Promise<void>
  courseId?: string // If provided, creates course-specific topic
}

// Mock categories - replace with actual API
const categories = [
  { id: 'programming', name: 'Lập trình' },
  { id: 'general', name: 'Thảo luận chung' },
  { id: 'help', name: 'Hỗ trợ kỹ thuật' },
  { id: 'tips', name: 'Mẹo học tập' },
  { id: 'showcase', name: 'Showcase dự án' },
  { id: 'course-discussion', name: 'Thảo luận khóa học' },
]

export function CreateTopicDialog({
  open,
  onOpenChange,
  onSubmit,
  courseId,
}: CreateTopicDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const editorRef = useRef<RichTextEditorRef>(null)

  const form = useForm<CreateTopicFormData>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: '',
      category: courseId ? 'course-discussion' : '',
      courseId,
      tags: [],
    },
  })

  const { watch, setValue } = form
  const tags = watch('tags')

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setValue('tags', [...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleSubmit = async (data: CreateTopicFormData) => {
    const content = editorRef.current?.getContent() || ''

    if (!content.trim()) {
      form.setError('root', { message: 'Nội dung không được để trống' })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ ...data, content })
      // Reset form on success
      form.reset()
      editorRef.current?.clear()
      onOpenChange(false)
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi tạo chủ đề',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCategories = courseId
    ? categories.filter((cat) => cat.id === 'course-discussion')
    : categories.filter((cat) => cat.id !== 'course-discussion')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {courseId ? 'Tạo chủ đề thảo luận khóa học' : 'Tạo chủ đề mới'}
          </DialogTitle>
          <DialogDescription>
            {courseId
              ? 'Tạo chủ đề thảo luận trong khóa học. Chủ đề cần được duyệt bởi giảng viên.'
              : 'Tạo chủ đề thảo luận mới. Chủ đề cần được duyệt bởi admin trước khi hiển thị.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề chủ đề *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề mô tả rõ ràng..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sử dụng tiêu đề rõ ràng, mô tả chính xác nội dung thảo luận
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục phù hợp" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormItem>
              <FormLabel>Thẻ tag</FormLabel>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Thêm thẻ tag (nhấn Enter hoặc dấu cách)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FormDescription>
                  Tối đa 5 thẻ tag để phân loại chủ đề (VD: react, javascript,
                  beginner)
                </FormDescription>
              </div>
            </FormItem>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Nội dung *</Label>
              <RichTextEditor
                ref={editorRef}
                placeholder="Mô tả chi tiết vấn đề, câu hỏi của bạn... Sử dụng @ để mention người dùng"
                className="min-h-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                Hãy mô tả rõ ràng và chi tiết để nhận được câu trả lời tốt nhất
              </p>
            </div>

            {/* Error Alert */}
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Approval Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {courseId
                  ? 'Chủ đề sẽ được gửi đến giảng viên để duyệt trước khi hiển thị công khai.'
                  : 'Chủ đề sẽ được gửi đến admin để duyệt trước khi hiển thị công khai.'}
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  'Tạo chủ đề'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

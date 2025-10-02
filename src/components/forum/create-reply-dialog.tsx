import { AlertCircle, Loader2, MessageSquare } from 'lucide-react'
import { useRef, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

import type { RichTextEditorRef } from '@/components/ui/rich-text-editor'

interface CreateReplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { content: string }) => Promise<void>
  topicTitle: string
  topicLocked?: boolean
}

export function CreateReplyDialog({
  open,
  onOpenChange,
  onSubmit,
  topicTitle,
  topicLocked = false,
}: CreateReplyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<RichTextEditorRef>(null)

  const handleSubmit = async () => {
    const content = editorRef.current?.getContent() || ''

    if (!content.trim()) {
      setError('Nội dung không được để trống')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({ content })
      // Reset form on success
      editorRef.current?.clear()
      onOpenChange(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi gửi bài trả lời',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (!isSubmitting) {
      editorRef.current?.clear()
      setError(null)
      onOpenChange(false)
    }
  }

  if (topicLocked) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chủ đề đã bị khóa
            </DialogTitle>
            <DialogDescription>
              Chủ đề này đã bị khóa và không thể trả lời thêm.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Trả lời chủ đề
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            Trả lời cho: <span className="font-medium">{topicTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Nội dung trả lời *</Label>
            <RichTextEditor
              ref={editorRef}
              placeholder="Viết câu trả lời của bạn... Sử dụng @ để mention người dùng"
              className="min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground">
              Hãy viết câu trả lời chi tiết và hữu ích. Sử dụng các công cụ định
              dạng để làm rõ nội dung.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Approval Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bài trả lời sẽ được gửi để duyệt trước khi hiển thị công khai.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Gửi trả lời
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

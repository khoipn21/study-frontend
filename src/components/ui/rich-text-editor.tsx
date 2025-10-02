import { forwardRef } from 'react'

// Import the CKEditor component
import RichTextEditorComponent from './ckeditor-editor'

export interface RichTextEditorRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
  clear: () => void
  blur: () => void
}

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(
  (
    {
      content = '',
      onChange,
      placeholder = 'Nhập nội dung...',
      className,
      readOnly = false,
    },
    ref,
  ) => {
    // Map legacy props to new editor props
    return (
      <RichTextEditorComponent
        ref={ref}
        defaultValue={content}
        onSubmit={onChange}
        placeholder={placeholder}
        className={className}
        editable={!readOnly}
        showToolbar={!readOnly}
        maxHeight={400}
      />
    )
  },
)

RichTextEditor.displayName = 'RichTextEditor'

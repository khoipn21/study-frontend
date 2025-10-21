import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'

import { MentionDropdown } from './mention-dropdown'

// Import CKEditor styles on client side only
const importCKEditorStyles = () => {
  import('@/styles/ckeditor.css')
}

export interface RichTextEditorRef {
  getContent: () => string
  setContent: (content: string) => void
  clear: () => void
  focus: () => void
  blur: () => void
}

interface RichTextEditorProps {
  placeholder?: string
  className?: string
  defaultValue?: string
  editable?: boolean
  onSubmit?: (content: string) => void
  maxHeight?: number
  showToolbar?: boolean
}

export function RichTextEditor(
  {
    placeholder = 'Start typing...',
    className,
    defaultValue = '',
    editable = true,
    onSubmit,
    maxHeight = 400,
    showToolbar = true,
  }: RichTextEditorProps,
  ref: React.Ref<RichTextEditorRef>,
) {
  const [editor, setEditor] = useState<any>(null)
  const [content, setContent] = useState(defaultValue)
  const [isClient, setIsClient] = useState(false)
  const [CKEditorModule, setCKEditorModule] = useState<any>(null)
  const [ClassicEditorModule, setClassicEditorModule] = useState<any>(null)

  // Mention state
  const [mentionState, setMentionState] = useState({
    isOpen: false,
    mentions: [] as Array<any>,
    selectedIndex: 0,
    position: { x: 0, y: 0 },
    query: '',
    marker: '@',
  })

  const editorRef = useRef<any>(null)

  // Ensure we're on the client side before importing CKEditor
  useEffect(() => {
    setIsClient(true)
    importCKEditorStyles()

    const loadCKEditor = async () => {
      try {
        const { CKEditor } = await import('@ckeditor/ckeditor5-react')
        const ClassicEditor = (
          await import('@ckeditor/ckeditor5-build-classic')
        ).default

        setCKEditorModule(() => CKEditor)
        setClassicEditorModule(() => ClassicEditor)
      } catch (error) {
        console.error('Failed to load CKEditor:', error)
      }
    }

    loadCKEditor()
  }, [])

  // Update content when defaultValue changes externally
  useEffect(() => {
    if (
      editor &&
      defaultValue !== content &&
      defaultValue !== editor.getData()
    ) {
      editor.setData(defaultValue)
      setContent(defaultValue)
    }
  }, [defaultValue, editor])

  // Expose editor methods via ref
  useImperativeHandle(
    ref,
    () => ({
      getContent: () => content,
      setContent: (newContent: string) => {
        setContent(newContent)
        if (editor) {
          editor.setData(newContent)
        }
      },
      clear: () => {
        setContent('')
        if (editor) {
          editor.setData('')
        }
      },
      focus: () => {
        if (editor) {
          editor.editing.view.focus()
        }
      },
      blur: () => {
        if (editor) {
          editor.editing.view.blur()
        }
      },
    }),
    [editor, content],
  )

  const handleEditorReady = (editorInstance: any) => {
    setEditor(editorInstance)
    editorRef.current = editorInstance

    if (defaultValue) {
      editorInstance.setData(defaultValue)
    }

    // Add mention handling
    setupMentionHandling(editorInstance)

    console.log('CKEditor is ready')
  }

  // Setup mention handling
  const setupMentionHandling = (editorInstance: any) => {
    // Use the editor's change event to detect mentions
    editorInstance.model.document.on('change:data', () => {
      const selection = editorInstance.model.document.selection
      const range = selection.getFirstRange()

      if (range) {
        const textBeforeCursor = getTextBeforeCursor(editorInstance, range)

        // Check if text ends with @ followed by word characters
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

        console.log('[Mention] Match result:', mentionMatch)

        if (mentionMatch) {
          const query = mentionMatch[1]

          // Trigger on @ even with empty query for better UX
          const cursorPosition = getCursorPosition(editorInstance)
          handleMentionTrigger(query, cursorPosition)
        } else {
          console.log('[Mention] No match, closing dropdown')
          closeMentionDropdown()
        }
      }
    })
  }

  // Helper function to get text before cursor
  const getTextBeforeCursor = (editorInstance: any, range: any) => {
    try {
      const model = editorInstance.model
      const position = range.end
      const block = position.parent

      // Get all text content from start of block to cursor position
      let textBeforeCursor = ''
      
      // Iterate through all children before cursor
      for (const child of block.getChildren()) {
        if (child.is('$text')) {
          const childEndOffset = block.getChildIndex(child) + child.data.length
          const cursorOffset = position.offset
          
          if (childEndOffset <= cursorOffset) {
            // This text node is completely before cursor
            textBeforeCursor += child.data
          } else if (block.getChildIndex(child) < cursorOffset) {
            // Cursor is in the middle of this text node
            const textLength = cursorOffset - block.getChildIndex(child)
            textBeforeCursor += child.data.substring(0, textLength)
            break
          } else {
            break
          }
        }
      }

      // Fallback: get text from root to current position
      if (!textBeforeCursor) {
        const root = model.document.getRoot()
        const walker = range.getWalker({ 
          startPosition: model.createPositionAt(root, 0),
          endPosition: position,
          singleCharacters: true 
        })

        for (const step of walker) {
          if (step.type === 'text') {
            textBeforeCursor += step.item.data
          }
        }
      }

      console.log('[Mention] Text before cursor:', textBeforeCursor)
      return textBeforeCursor
    } catch (error) {
      console.error('Error getting text before cursor:', error)
      
      // Final fallback - get last 50 characters of editor content
      try {
        const editorData = editorInstance.getData()
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = editorData
        const fullText = tempDiv.textContent || tempDiv.innerText || ''
        return fullText.slice(-50) // Last 50 chars
      } catch {
        return ''
      }
    }
  }

  // Get cursor position for dropdown positioning
  const getCursorPosition = (editorInstance: any) => {
    try {
      const view = editorInstance.editing.view
      const selection = view.document.selection
      const range = selection.getFirstRange()

      if (range) {
        // Get the DOM rect of the current selection
        const domRange = view.domConverter.viewRangeToDom(range)
        const rect = domRange.getBoundingClientRect()
        
        // Position relative to viewport (fixed positioning)
        let x = rect.left
        let y = rect.bottom + 5 // 5px offset below cursor
        
        // Ensure dropdown stays within viewport
        const dropdownWidth = 200
        const dropdownHeight = 240 // max-h-60 = 240px
        
        // Check if dropdown would go off right edge
        if (x + dropdownWidth > window.innerWidth) {
          x = window.innerWidth - dropdownWidth - 10
        }
        
        // Check if dropdown would go off bottom edge
        if (y + dropdownHeight > window.innerHeight) {
          // Position above cursor instead
          y = rect.top - dropdownHeight - 5
        }
        
        // Ensure minimum position
        x = Math.max(10, x)
        y = Math.max(10, y)
        
        console.log('[Mention] Cursor position:', { x, y, rect })
        
        return { x, y }
      }
    } catch (error) {
      console.error('Failed to get cursor position:', error)
      
      // Fallback: try to get editor container position
      try {
        const editorElement = editorInstance.ui.view.editable.element
        if (editorElement) {
          const rect = editorElement.getBoundingClientRect()
          return {
            x: rect.left + 20,
            y: rect.top + 40,
          }
        }
      } catch (fallbackError) {
        console.error('Fallback position failed:', fallbackError)
      }
    }

    return { x: 100, y: 100 }
  }

  // Handle mention trigger
  const handleMentionTrigger = async (
    query: string,
    cursorPosition: { x: number; y: number },
  ) => {
    try {
      // Pass query and limit as parameters to the API
      // If query is empty, show all users (up to limit)
      console.log('[Mention] Searching users with query:', query)
      const response = await api.getUsers({ 
        q: query, 
        limit: 10 
      })
      console.log('[Mention] Found users:', response?.length || 0)
      const users = response || []

      setMentionState({
        isOpen: true,
        mentions: users,
        selectedIndex: 0,
        position: cursorPosition,
        query,
        marker: '@',
      })
    } catch (error) {
      console.error('Failed to fetch users for mentions:', error)
      closeMentionDropdown()
    }
  }

  // Close mention dropdown
  const closeMentionDropdown = useCallback(() => {
    setMentionState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  // Handle mention selection
  const handleMentionSelect = useCallback(
    (user: any) => {
      if (editorRef.current) {
        insertMention(user)
        closeMentionDropdown()
      }
    },
    [closeMentionDropdown],
  )

  // Insert mention into editor
  const insertMention = (user: any) => {
    const editor = editorRef.current
    if (!editor) return

    const model = editor.model
    const selection = model.document.selection
    const range = selection.getFirstRange()

    if (range) {
      const textBeforeCursor = getTextBeforeCursor(editor, range)
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

      if (mentionMatch) {
        const mentionText = `@${user.username} `
        const matchLength = mentionMatch[0].length
        const position = range.end

        model.change((writer: any) => {
          // Calculate the start position by going back from current position
          const parent = position.parent
          const offset = position.offset
          const startOffset = Math.max(0, offset - matchLength)
          
          const startPosition = writer.createPositionAt(parent, startOffset)
          const endPosition = position
          
          const deleteRange = writer.createRange(startPosition, endPosition)
          
          // Remove the @query text
          writer.remove(deleteRange)
          
          // Insert the full mention
          writer.insertText(mentionText, startPosition)
          
          // Move cursor after the mention
          const newPosition = writer.createPositionAt(
            parent,
            startOffset + mentionText.length
          )
          writer.setSelection(newPosition)
        })
      }
    }
  }

  // Handle keyboard navigation
  const handleMentionKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!mentionState.isOpen) return false

      const users = mentionState.mentions
      let newIndex = mentionState.selectedIndex

      switch (event.key) {
        case 'ArrowDown':
          newIndex = (mentionState.selectedIndex + 1) % users.length
          setMentionState((prev) => ({ ...prev, selectedIndex: newIndex }))
          return true
        case 'ArrowUp':
          newIndex =
            mentionState.selectedIndex <= 0
              ? users.length - 1
              : mentionState.selectedIndex - 1
          setMentionState((prev) => ({ ...prev, selectedIndex: newIndex }))
          return true
        case 'Enter':
        case 'Tab':
          if (users[mentionState.selectedIndex]) {
            handleMentionSelect(users[mentionState.selectedIndex])
          }
          return true
        case 'Escape':
          closeMentionDropdown()
          return true
        default:
          return false
      }
    },
    [mentionState, handleMentionSelect, closeMentionDropdown],
  )

  const handleChange = (_event: any, editorInstance: any) => {
    const data = editorInstance.getData()
    setContent(data)
    if (onSubmit) {
      onSubmit(data)
    }
  }
  const licenseKey = import.meta.env.VITE_CKEDITOR_LICENSE_KEY

  // Show a placeholder or loading state while loading modules
  if (!isClient || !CKEditorModule || !ClassicEditorModule) {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        <div
          className="overflow-auto ck-editor-wrapper flex items-center justify-center text-muted-foreground"
          style={{ maxHeight: `${maxHeight}px`, minHeight: '100px' }}
        >
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('border rounded-lg overflow-hidden relative', className)}
    >
      <div
        className="overflow-auto ck-editor-wrapper"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <CKEditorModule
          editor={ClassicEditorModule}
          config={{
            licenseKey: licenseKey,
            placeholder: placeholder,
            toolbar: showToolbar
              ? {
                  items: [
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'code',
                    '|',
                    'heading1',
                    'heading2',
                    'heading3',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'blockQuote',
                    'horizontalLine',
                    '|',
                    'link',
                    'undo',
                    'redo',
                  ],
                }
              : undefined,
            heading: {
              options: [
                {
                  model: 'heading1',
                  view: 'h1',
                  title: 'Heading 1',
                  class: 'ck-heading_heading1',
                },
                {
                  model: 'heading2',
                  view: 'h2',
                  title: 'Heading 2',
                  class: 'ck-heading_heading2',
                },
                {
                  model: 'heading3',
                  view: 'h3',
                  title: 'Heading 3',
                  class: 'ck-heading_heading3',
                },
              ],
            },
            link: {
              addTargetToExternalLinks: true,
              defaultProtocol: 'https://',
            },
          }}
          data={content}
          disabled={!editable}
          onReady={handleEditorReady}
          onChange={handleChange}
        />
      </div>

      {/* Mention Dropdown */}
      <MentionDropdown
        users={mentionState.mentions}
        selectedIndex={mentionState.selectedIndex}
        onSelect={handleMentionSelect}
        onKeyDown={handleMentionKeyDown}
        position={mentionState.position}
        isOpen={mentionState.isOpen}
      />
    </div>
  )
}

export default forwardRef(RichTextEditor)

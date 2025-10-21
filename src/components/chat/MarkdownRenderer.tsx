import { Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Import KaTeX CSS
import 'katex/dist/katex.min.css'
// Import highlight.js theme
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn('prose prose-sm dark:prose-invert max-w-none', className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Custom code block with copy button
          pre: ({ children, ...props }) => {
            const node = (props as any).node
            const codeContent = node?.children?.[0]
            const codeText =
              codeContent?.type === 'element' &&
              codeContent?.children?.[0]?.type === 'text'
                ? codeContent.children[0].value
                : ''

            return (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-t-lg border-b">
                  <span className="text-xs font-medium text-muted-foreground">
                    Code
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(codeText)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <pre
                  {...props}
                  className="!mt-0 !rounded-t-none overflow-x-auto bg-muted/50 p-4"
                >
                  {children}
                </pre>
              </div>
            )
          },
          // Inline code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Tables
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-muted" {...props} />,
          th: ({ ...props }) => (
            <th
              className="px-4 py-2 text-left text-xs font-medium"
              {...props}
            />
          ),
          td: ({ ...props }) => <td className="px-4 py-2 text-sm" {...props} />,
          // Links
          a: ({ ...props }) => (
            <a
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Blockquotes
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic my-4"
              {...props}
            />
          ),
          // Lists
          ul: ({ ...props }) => (
            <ul className="list-disc list-inside my-2 space-y-1" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol
              className="list-decimal list-inside my-2 space-y-1"
              {...props}
            />
          ),
          // Headings
          h1: ({ ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="text-base font-bold mt-3 mb-2" {...props} />
          ),
          // Paragraphs
          p: ({ ...props }) => <p className="my-2 leading-7" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

import { FileText, Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { Button } from '@/components/ui/button'

// Set up PDF.js worker - only on client side
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
}

interface PDFPreviewProps {
  src: string
  onError: () => void
}

// Enhanced PDF Preview Component with react-pdf
export function PDFPreview({ src, onError }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)

  const onDocumentLoadSuccess = ({
    numPages: totalPages,
  }: {
    numPages: number
  }) => {
    setNumPages(totalPages)
    setIsLoading(false)
    setPdfError(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error)
    setIsLoading(false)
    setPdfError(true)
    onError()
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.5))

  if (pdfError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium mb-2">Unable to load PDF</p>
        <p className="text-sm text-center max-w-md">
          This PDF cannot be previewed in the browser. You can download it to
          view with your preferred PDF reader.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* PDF Controls */}
      <div className="flex items-center justify-between mb-4 p-2 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-mono min-w-[4rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <span className="text-sm px-2">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="border rounded-lg bg-white overflow-auto max-h-[60vh]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}
        <Document
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            }
          />
        </Document>
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Use the controls above to navigate and zoom within the PDF
      </div>
    </div>
  )
}

export default PDFPreview

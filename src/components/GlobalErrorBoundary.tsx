import React, { Component } from 'react'
import { AlertTriangle, Home, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    this.props.onError?.(error, errorInfo)

    // Log error to your error reporting service
    console.error('Application Error:', error, errorInfo)

    // In production, you could send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription>
                An unexpected error occurred while loading the page. Don't
                worry, our team has been notified and is working on it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {this.state.error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>If the problem persists, please contact our support team:</p>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  <Mail className="mr-1 h-3 w-3" />
                  support@studyplatform.com
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' &&
                this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                      Developer Information (Development Mode)
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-3 rounded-md overflow-auto max-h-40 border">
                      <div className="font-semibold text-red-600 mb-2">
                        Error Stack:
                      </div>
                      {this.state.error?.stack}
                      {'\n\n'}
                      <div className="font-semibold text-blue-600 mb-2">
                        Component Stack:
                      </div>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<TProps extends object>(
  WrappedComponent: React.ComponentType<TProps>,
  fallback?: ReactNode,
) {
  const ComponentWithErrorBoundary = (props: TProps) => (
    <GlobalErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </GlobalErrorBoundary>
  )

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name
  })`

  return ComponentWithErrorBoundary
}

// Hook for handling async errors in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error('Async Error:', error)
    setError(error)
    throw error // Re-throw to be caught by error boundary
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Reset error state when component unmounts
  React.useEffect(() => {
    return () => setError(null)
  }, [])

  return { error, handleError, clearError }
}

// Utility function to handle promises with error boundary integration
export function withErrorBoundaryAsync<T>(
  promise: Promise<T>,
  errorHandler: (error: Error) => void,
): Promise<T> {
  return promise.catch((error) => {
    errorHandler(error)
    throw error
  })
}

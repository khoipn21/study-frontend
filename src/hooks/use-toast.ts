import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  action?: React.ReactNode
}

export function useToast() {
  const toast = ({
    title,
    description,
    variant = 'default',
    action,
  }: ToastProps) => {
    const message = title || description || ''
    const fullDescription = title && description ? description : undefined

    if (variant === 'destructive') {
      return sonnerToast.error(message, {
        description: fullDescription,
        action: action as any,
      })
    }

    return sonnerToast(message, {
      description: fullDescription,
      action: action as any,
    })
  }

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

// Export individual toast methods for convenience
export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),
  info: (message: string, description?: string) =>
    sonnerToast.info(message, { description }),
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, { description }),
  loading: (message: string, description?: string) =>
    sonnerToast.loading(message, { description }),
  dismiss: sonnerToast.dismiss,
}

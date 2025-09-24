import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import { config } from '@/lib/config'
import Header from '../components/Header'
import { ThemeProvider } from '../lib/theme-context'
import { StripeProvider } from '../lib/stripe-context'
import { GlobalErrorBoundary } from '../components/GlobalErrorBoundary'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: config.appName },
      {
        name: 'description',
        content:
          'Professional online learning platform with interactive courses, video lectures, and AI-powered tutoring',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <GlobalErrorBoundary>
          <ThemeProvider>
            <StripeProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Header />
                <main className="relative">{children}</main>
              </div>
              <TanstackDevtools
                config={{
                  position: 'bottom-left',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
            </StripeProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
        <Scripts />
      </body>
    </html>
  )
}

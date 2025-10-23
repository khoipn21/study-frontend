import { TanstackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { config } from '@/lib/config'

import { GlobalErrorBoundary } from '../components/GlobalErrorBoundary'
import Header from '../components/Header'
import NotFound from '../components/NotFound'
import { MicrocopyProvider } from '../components/ui/microcopy-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { StripeProvider } from '../lib/stripe-context'
import { ThemeProvider } from '../lib/theme-context'
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

  notFoundComponent: NotFound,
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
            <MicrocopyProvider>
              <StripeProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Header />
                  <main className="relative">{children}</main>
                </div>
              {import.meta.env.DEV && (
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
              )}
              </StripeProvider>
            </MicrocopyProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
        <Scripts />
      </body>
    </html>
  )
}

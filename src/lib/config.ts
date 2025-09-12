export type AppConfig = {
  apiBaseUrl: string
  useMockApi: boolean
  appName: string
}

const env = import.meta.env

export const config: AppConfig = {
  apiBaseUrl: String(env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'),
  useMockApi: String(env.VITE_USE_MOCK_API || 'false').toLowerCase() === 'true',
  appName: String(env.VITE_APP_NAME || 'Study Platform'),
}

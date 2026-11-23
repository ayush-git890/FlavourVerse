import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if (command === 'build') {
    let apiUrl
    try {
      apiUrl = new URL(env.VITE_API_URL)
    } catch {
      throw new Error('Set VITE_API_URL to the deployed backend HTTPS URL before building.')
    }
    if (apiUrl.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname)) {
      throw new Error('VITE_API_URL must be a public HTTPS backend URL, not localhost.')
    }
  }
  return { plugins: [react()] }
})

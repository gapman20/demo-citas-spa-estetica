import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Serve index.html for any unknown route so BrowserRouter handles navigation
    historyApiFallback: true,
  },
  preview: {
    // Same fallback for `vite preview` (production-like local builds)
    historyApiFallback: true,
  },
})

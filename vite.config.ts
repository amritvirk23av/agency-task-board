import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths, so the same build runs at a domain root (Vercel,
  // Netlify) or under a project path (GitHub Pages). Safe here — no client
  // routing.
  base: './',
  plugins: [react(), tailwindcss()],
  // @dnd-kit and lucide-react each pull in React; keep a single copy so hooks
  // share one dispatcher.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
})

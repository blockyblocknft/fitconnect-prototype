import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal typing for the Node build env (avoids pulling in @types/node).
declare const process: { env: Record<string, string | undefined> }

// On Vercel, serve from the domain root ('/'); for GitHub Pages keep the
// project subpath. Vercel sets the VERCEL env var during its build.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/fitconnect-prototype/',
  plugins: [react()],
})

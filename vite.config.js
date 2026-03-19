import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuración principal de Vite para el proyecto GoodLuck
// - react(): habilita soporte JSX y Fast Refresh
// - tailwindcss(): integra Tailwind v4 directamente como plugin de Vite (sin postcss.config)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

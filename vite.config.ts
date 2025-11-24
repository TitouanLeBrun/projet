import path from 'path'

// https://vitejs.dev/config/
export default (async () => {
  const { defineConfig } = await import('vite')
  const react = (await import('@vitejs/plugin-react')).default

  return defineConfig({
    plugins: [react()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      strictPort: true,
    }
  })
})()

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  process.env.VITE_IMAGEKIT_URL_ENDPOINT = process.env.VITE_IMAGEKIT_URL_ENDPOINT || env.VITE_IMAGEKIT_URL_ENDPOINT;
  process.env.VITE_IMAGEKIT_PUBLIC_KEY = process.env.VITE_IMAGEKIT_PUBLIC_KEY || env.VITE_IMAGEKIT_PUBLIC_KEY;
  process.env.IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || env.IMAGEKIT_PRIVATE_KEY;

  return {
    base: './',
    plugins: [inspectAttr(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  nitro: {
    experimental: {
      database: true,
    },
  },

  imports: {
    autoImport: true,
  },

  modules: ["nuxt-auth-utils"],
})
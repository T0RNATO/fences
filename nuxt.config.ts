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

    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: "tornato-fences",
      },
    },

    database: {
      default: {
        connector: "cloudflare-d1",
        options: {
          bindingName: "DB",
        }
      }
    },

    devDatabase: {
      default: {
        connector: "sqlite",
        options: {
          name: "db",
        }
      }
    }
  },

  imports: {
    autoImport: true,
  },

  modules: ["nuxt-auth-utils"],
})
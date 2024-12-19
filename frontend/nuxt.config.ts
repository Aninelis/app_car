// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // router: {middleware: ['auth'] // Ativa o middleware globalmente
  devtools: { enabled: true },

  modules: ['vuetify-nuxt-module']
})
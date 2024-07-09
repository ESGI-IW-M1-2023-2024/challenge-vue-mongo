// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme: {
          dark: false,
          colors: {
            primary: '#457B9D',
            secondary: '#A8DADC',
            accent: '#E63946',
            info: '#F1FAEE',
            success: '#1D3557'
          }
        }
      }
    }
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})

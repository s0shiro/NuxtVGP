import { createVuetify } from 'vuetify'
import * as labs from 'vuetify/labs/components'
import 'vuetify/styles'
// Use this if you want only icons used by Vuetify components internally should be imported
// import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		components: { ...labs },
		// Refer to https://vuetifyjs.com/en/features/icon-fonts/
		// icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
		ssr: true,
		theme: {
			defaultTheme: 'light', // Default theme that will be updated after hydration
			themes: {
				light: {
					colors: {
						primary: '#1976D2',
						secondary: '#424242',
						accent: '#82B1FF',
						error: '#FF5252',
						info: '#2196F3',
						success: '#4CAF50',
						warning: '#FFC107',
						background: '#F5F5F5'
					}
				},
				dark: {
					colors: {
						primary: '#2196F3',
						secondary: '#616161',
						accent: '#82B1FF',
						error: '#FF5252',
						info: '#2196F3',
						success: '#4CAF50',
						warning: '#FFC107',
						background: '#121212'
					},
					dark: true
				}
			}
		}
	})

	// Only run on client-side to avoid SSR issues with localStorage
	if (import.meta.client) {
		nuxtApp.hook('app:mounted', () => {
			try {
				// Get theme store
				const themeStore = useThemeStore()
				// Set Vuetify theme based on store value
				vuetify.theme.global.name.value = themeStore.mode
				
				// Watch for theme changes
				watch(() => themeStore.mode, (newTheme) => {
					vuetify.theme.global.name.value = newTheme
				})
			} catch (error) {
				console.error('Error applying theme:', error)
				// Fallback to light theme if there's an error
				vuetify.theme.global.name.value = 'light'
			}
		})
	}

	nuxtApp.vueApp.use(vuetify)
})

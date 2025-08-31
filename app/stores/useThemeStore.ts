import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Helper for safe localStorage access
const getThemeFromStorage = (): 'light' | 'dark' => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('app-theme')
      if (saved === 'light' || saved === 'dark') {
        return saved
      }
    } catch (e) {
      console.warn('Error reading theme from localStorage', e)
    }
  }
  return 'dark' // Default theme
}

export const useThemeStore = defineStore('theme', () => {
  // Initialize with saved theme or default
  const mode = ref<'light' | 'dark'>(getThemeFromStorage())
  
  // Computed properties
  const isDark = computed(() => mode.value === 'dark')
  
  // Save changes to localStorage
  watch(mode, (newTheme) => {
    if (import.meta.client) {
      try {
        localStorage.setItem('app-theme', newTheme)
      } catch (e) {
        console.warn('Error saving theme to localStorage', e)
      }
    }
  })
  
  // Actions
  function toggleTheme() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }
  
  function setTheme(theme: 'light' | 'dark') {
    mode.value = theme
  }
  
  return {
    mode,
    isDark,
    toggleTheme,
    setTheme
  }
})

import type { Rocket } from '~/composables/types'

export const useFavorites = defineStore('favorites', () => {
  // State
  const favoriteRockets = ref<Rocket[]>([])
  
  // Getters
  const favorites = readonly(favoriteRockets)
  const favoriteCount = computed(() => favoriteRockets.value.length)
  const hasFavorites = computed(() => favoriteRockets.value.length > 0)
  
  // Check if a rocket is favorited
  const isFavorite = (rocketId: string): boolean => {
    return favoriteRockets.value.some(rocket => rocket.id === rocketId)
  }
  
  // Actions
  const addToFavorites = (rocket: Rocket) => {
    // Check if rocket is already in favorites
    if (!isFavorite(rocket.id)) {
      favoriteRockets.value.push(rocket)
      
      // Persist to localStorage
      if (import.meta.client) {
        localStorage.setItem('spacex-favorites', JSON.stringify(favoriteRockets.value))
      }
    }
  }
  
  const removeFromFavorites = (rocketId: string) => {
    const index = favoriteRockets.value.findIndex(rocket => rocket.id === rocketId)
    if (index > -1) {
      favoriteRockets.value.splice(index, 1)
      
      // Persist to localStorage
      if (import.meta.client) {
        localStorage.setItem('spacex-favorites', JSON.stringify(favoriteRockets.value))
      }
    }
  }
  
  const toggleFavorite = (rocket: Rocket) => {
    if (isFavorite(rocket.id)) {
      removeFromFavorites(rocket.id)
    } else {
      addToFavorites(rocket)
    }
  }
  
  const clearAllFavorites = () => {
    favoriteRockets.value = []
    
    // Clear from localStorage
    if (import.meta.client) {
      localStorage.removeItem('spacex-favorites')
    }
  }
  
  // Initialize favorites from localStorage
  const initializeFavorites = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('spacex-favorites')
        if (saved) {
          const parsed = JSON.parse(saved) as Rocket[]
          favoriteRockets.value = parsed
        }
      } catch (error) {
        console.warn('Failed to load favorites from localStorage:', error)
        // Clear corrupted data
        localStorage.removeItem('spacex-favorites')
      }
    }
  }
  
  return {
    // State
    favorites,
    favoriteCount,
    hasFavorites,
    
    // Getters
    isFavorite,
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,
    initializeFavorites
  }
})

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}

import type { Rocket } from '~/composables/types'
import localForage from 'localforage'

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
    }
  }
  
  const removeFromFavorites = (rocketId: string) => {
    const index = favoriteRockets.value.findIndex(rocket => rocket.id === rocketId)
    if (index > -1) {
      favoriteRockets.value.splice(index, 1)
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
  }
  
  // Migrate data from old localStorage if needed
  const migrateFromLocalStorage = async () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('spacex-favorites')
        if (saved && favoriteRockets.value.length === 0) {
          const parsed = JSON.parse(saved) as Rocket[]
          favoriteRockets.value = parsed
          console.info('Migrated favorites from localStorage to IndexedDB')
          
          // Clear old data
          localStorage.removeItem('spacex-favorites')
        }
      } catch (error) {
        console.warn('Failed to migrate favorites from localStorage:', error)
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
    migrateFromLocalStorage
  }
}, {
  // Configure persistence with IndexedDB
  persist: {
    storage: localForage,
    debug: import.meta.dev
  }
})

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}

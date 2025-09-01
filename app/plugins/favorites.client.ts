export default defineNuxtPlugin(() => {
  // Migrate any existing localStorage data to IndexedDB
  const favoritesStore = useFavorites()
  
  // Run migration if needed
  if (import.meta.client) {
    favoritesStore.migrateFromLocalStorage()
  }
})

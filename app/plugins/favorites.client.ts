export default defineNuxtPlugin(() => {
  // Initialize favorites from localStorage on client side
  const favoritesStore = useFavorites()
  favoritesStore.initializeFavorites()
})

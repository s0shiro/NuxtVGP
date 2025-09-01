import type { Pinia } from 'pinia'
import localForage from 'localforage'
import { createStatePersistence } from 'pinia-plugin-state-persistence'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Only initialize persistence on the client side
  if (!import.meta.client) {
    console.info('Skipping IndexedDB initialization on server side')
    return
  }

  // Configure localForage for IndexedDB
  localForage.config({
    driver: [localForage.INDEXEDDB], // Prefer IndexedDB only
    name: 'NuxtVGP',
    version: 1.0,
    storeName: 'favorites', // Collection name
    description: 'Persistent storage for favorites and app state'
  })

  try {
    // Make sure IndexedDB is available and ready
    await localForage.ready()
    console.info('IndexedDB initialized successfully, using driver:', localForage.driver())
    
    // Register the plugin with Pinia
    ;(nuxtApp.$pinia as Pinia).use(
      createStatePersistence({
        key: 'app', // Global prefix for all store keys
        debug: import.meta.dev, // Enable debugging in development
        clientOnly: true, // Only run in client
        storage: localForage, // Use localForage (IndexedDB) for storage
      }),
    )
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error)
  }
})

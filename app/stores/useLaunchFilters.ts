export const useLaunchFilters = defineStore('launchFilters', () => {
  // State
  const selectedYear = ref<string | null>(null)
  const availableYears = ref<string[]>([])
  
  // Getters
  const hasActiveFilter = computed(() => selectedYear.value !== null)
  
  // Actions
  const setSelectedYear = (year: string | null) => {
    selectedYear.value = year
  }
  
  const setAvailableYears = (years: string[]) => {
    availableYears.value = years.sort((a, b) => parseInt(b) - parseInt(a)) // Sort descending
  }
  
  const clearFilters = () => {
    selectedYear.value = null
  }
  
  const resetStore = () => {
    selectedYear.value = null
    availableYears.value = []
  }
  
  return {
    // State
    selectedYear: readonly(selectedYear),
    availableYears: readonly(availableYears),
    
    // Getters
    hasActiveFilter,
    
    // Actions
    setSelectedYear,
    setAvailableYears,
    clearFilters,
    resetStore
  }
})

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaunchFilters, import.meta.hot))
}

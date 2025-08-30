interface Launch {
  id: string
  mission_name: string
  launch_date_local: string
  launch_date_unix: string
  launch_date_utc: string
  launch_site: {
    site_id: string
    site_name: string
    site_name_long: string
  } | null
  rocket: {
    rocket_name: string
  } | null
  details: string | null
  launch_year?: string
}

export const useLaunchFiltering = (launches: Ref<Launch[]>) => {
  const filterStore = useLaunchFilters()
  
  // Extract unique years from launches and update store
  const extractAndSetYears = () => {
    if (!launches.value || launches.value.length === 0) return
    
    const years = launches.value
      .map(launch => {
        if (launch.launch_date_local) {
          return new Date(launch.launch_date_local).getFullYear().toString()
        }
        return null
      })
      .filter((year): year is string => year !== null)
      .filter((year, index, array) => array.indexOf(year) === index) // Remove duplicates
    
    filterStore.setAvailableYears(years)
  }
  
  // Filter launches based on selected year
  const filteredLaunches = computed(() => {
    if (!launches.value) return []
    
    if (!filterStore.selectedYear) {
      return launches.value
    }
    
    return launches.value.filter(launch => {
      if (!launch.launch_date_local) return false
      const launchYear = new Date(launch.launch_date_local).getFullYear().toString()
      return launchYear === filterStore.selectedYear
    })
  })
  
  // Statistics
  const filterStats = computed(() => {
    const total = launches.value?.length || 0
    const filtered = filteredLaunches.value.length
    const hasFilter = filterStore.hasActiveFilter
    
    return {
      total,
      filtered,
      hasFilter,
      hiddenCount: hasFilter ? total - filtered : 0
    }
  })
  
  // Filter methods
  const filterByYear = (year: string | null) => {
    filterStore.setSelectedYear(year)
  }
  
  const clearAllFilters = () => {
    filterStore.clearFilters()
  }
  
  // Initialize years when launches change
  watch(launches, extractAndSetYears, { immediate: true })
  
  // Cleanup on unmount
  onUnmounted(() => {
    filterStore.resetStore()
  })
  
  return {
    // Filtered data
    filteredLaunches: readonly(filteredLaunches),
    
    // Filter state from store
    selectedYear: filterStore.selectedYear,
    availableYears: filterStore.availableYears,
    hasActiveFilter: filterStore.hasActiveFilter,
    
    // Statistics
    filterStats: readonly(filterStats),
    
    // Methods
    filterByYear,
    clearAllFilters,
    extractAndSetYears
  }
}

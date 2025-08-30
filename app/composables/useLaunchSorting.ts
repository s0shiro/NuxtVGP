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

export type SortOrder = 'asc' | 'desc'

export const useLaunchSorting = (launches: Ref<Launch[]>) => {
  // Reactive state for sort order
  const sortOrder = ref<SortOrder>('asc')
  
  // Sort launches by launch date
  const sortedLaunches = computed(() => {
    if (!launches.value || launches.value.length === 0) return []
    
    return [...launches.value].sort((a, b) => {
      // Use launch_date_unix for more accurate sorting if available
      const dateA = a.launch_date_unix ? parseInt(a.launch_date_unix) : new Date(a.launch_date_local).getTime()
      const dateB = b.launch_date_unix ? parseInt(b.launch_date_unix) : new Date(b.launch_date_local).getTime()
      
      if (sortOrder.value === 'asc') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  })
  
  // Method to change sort order
  const setSortOrder = (order: SortOrder) => {
    sortOrder.value = order
  }
  
  // Method to toggle sort order
  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  
  return {
    // Sorted data
    sortedLaunches,
    
    // Sort state
    sortOrder: readonly(sortOrder),
    
    // Methods
    setSortOrder,
    toggleSortOrder
  }
}

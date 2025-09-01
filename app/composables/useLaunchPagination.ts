import type { Launch, PaginationState, PaginationResult } from './types'

export const useLaunchPagination = (allLaunches: Ref<Launch[]> | Readonly<Ref<Launch[]>>) => {
  // Pagination state
  const currentPage = ref(1)
  const pageSize = ref(12) // Default page size
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed pagination data
  const totalItems = computed(() => allLaunches.value?.length || 0)

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / pageSize.value)
  )

  const hasNextPage = computed(() =>
    currentPage.value < totalPages.value
  )

  const hasPreviousPage = computed(() =>
    currentPage.value > 1
  )

  const startItem = computed(() =>
    (currentPage.value - 1) * pageSize.value + 1
  )

  const endItem = computed(() =>
    Math.min(currentPage.value * pageSize.value, totalItems.value)
  )

  // Paginated launches
  const paginatedLaunches = computed(() => {
    if (!allLaunches.value || allLaunches.value.length === 0) return []

    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value

    return allLaunches.value.slice(start, end)
  })

  // Pagination result object
  const paginationResult = computed<PaginationResult>(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    totalItems: totalItems.value,
    totalPages: totalPages.value,
    hasNextPage: hasNextPage.value,
    hasPreviousPage: hasPreviousPage.value,
    startItem: startItem.value,
    endItem: endItem.value
  }))

  // Methods
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const firstPage = () => {
    currentPage.value = 1
  }

  const lastPage = () => {
    currentPage.value = totalPages.value
  }

  const setPageSize = (size: number) => {
    if (size > 0) {
      pageSize.value = size
      // Reset to first page when changing page size
      currentPage.value = 1
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
    isLoading.value = false
    error.value = null
  }

  // Watch for changes in total items and adjust current page if necessary
  watch(totalItems, (newTotal) => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  })

  // Watch for page size changes
  watch(pageSize, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  })

  return {
    // State
    currentPage: readonly(currentPage),
    pageSize: readonly(pageSize),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    paginatedLaunches: readonly(paginatedLaunches),
    paginationResult: readonly(paginationResult),
    hasNextPage: readonly(hasNextPage),
    hasPreviousPage: readonly(hasPreviousPage),

    // Methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
    resetPagination
  }
}

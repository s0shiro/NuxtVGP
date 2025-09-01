<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">
          <v-icon icon="mdi-rocket-launch" class="mr-3" />
          SpaceX Launches
        </h1>
        
        <!-- Loading state -->
        <div v-if="pending" class="text-center py-12">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          />
          <p class="mt-4 text-h6">Loading launches...</p>
        </div>

        <!-- Error state -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="mb-6"
        >
          <v-alert-title>Error Loading Launches</v-alert-title>
          {{ error.message }}
        </v-alert>

        <!-- Success state - Display launches -->
        <div v-else-if="launches && launches.length > 0">
          <!-- Filter Controls -->
          <v-card class="mb-6" elevation="1">
            <v-card-title>
              <v-icon icon="mdi-filter" class="mr-2" />
              Filter & Sort Launches
            </v-card-title>
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedYear"
                    :items="yearFilterItems"
                    label="Filter by Launch Year"
                    variant="outlined"
                    clearable
                    prepend-inner-icon="mdi-calendar"
                    hint="Select a year to filter launches"
                    persistent-hint
                    @update:model-value="filterByYear"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="sortOrder"
                    :items="[
                      { title: 'Oldest First', value: 'asc' },
                      { title: 'Newest First', value: 'desc' }
                    ]"
                    label="Sort by Launch Date"
                    variant="outlined"
                    prepend-inner-icon="mdi-sort-calendar-ascending"
                    hint="Sort launches by date"
                    persistent-hint
                    @update:model-value="setSortOrder"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="d-flex align-center gap-2">
                    <v-chip
                      v-if="hasActiveFilter"
                      color="warning"
                      variant="elevated"
                      closable
                      @click:close="clearAllFilters"
                    >
                      <v-icon icon="mdi-filter" class="mr-1" />
                      Year: {{ selectedYear }}
                    </v-chip>
                    <v-chip
                      color="info"
                      variant="elevated"
                    >
                      <v-icon icon="mdi-sort" class="mr-1" />
                      {{ sortOrder === 'asc' ? 'Oldest First' : 'Newest First' }}
                    </v-chip>
                    <v-btn
                      v-if="hasActiveFilter"
                      variant="outlined"
                      size="small"
                      @click="clearFiltersAndReset"
                    >
                      Clear All Filters
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Launches Grid or No Results -->
          <div v-if="paginatedLaunches.length > 0">
            <transition-group name="launch-grid" tag="div" class="v-row">
              <v-col
                v-for="launch in paginatedLaunches"
                :key="launch.id"
                cols="12"
                md="6"
                lg="4"
                class="launch-item"
              >
                <AppCard
                  :title="launch.mission_name"
                  icon="mdi-rocket-launch"
                  :elevation="3"
                  hover
                  card-class="launch-card"
                >
                  <!-- Launch Information Grid -->
                  <div class="launch-info-grid">
                    <!-- Launch Date Card -->
                    <v-card 
                      variant="tonal" 
                      color="primary" 
                      class="info-card"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon icon="mdi-calendar" color="primary" class="mr-2" />
                          <span class="text-subtitle-2 font-weight-bold text-primary">Launch Date</span>
                        </div>
                        <p class="text-body-2 mb-1">
                          {{ formatLaunchDateUtil(launch.launch_date_local) }}
                        </p>
                      </v-card-text>
                    </v-card>

                    <!-- Launch Site Card -->
                    <v-card 
                      variant="tonal" 
                      color="blue" 
                      class="info-card"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon icon="mdi-map-marker" color="blue" class="mr-2" />
                          <span class="text-subtitle-2 font-weight-bold text-blue">Launch Site</span>
                        </div>
                        <p class="text-body-2 mb-1 font-weight-medium">
                          {{ launch.launch_site?.site_name || 'Unknown' }}
                        </p>
                        <p v-if="launch.launch_site?.site_name_long" class="text-caption text-medium-emphasis">
                          {{ launch.launch_site.site_name_long }}
                        </p>
                        <p v-else class="text-caption text-medium-emphasis">
                          Location details unavailable
                        </p>
                      </v-card-text>
                    </v-card>

                    <!-- Rocket Information Card -->
                    <v-card 
                      variant="tonal" 
                      color="orange" 
                      class="info-card rocket-card"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <div class="d-flex align-center">
                            <v-icon icon="mdi-rocket" color="orange" class="mr-2" />
                            <span class="text-subtitle-2 font-weight-bold text-orange">Rocket</span>
                          </div>
                          <!-- Favorites Button -->
                          <v-btn
                            v-if="launch.rocket?.rocket?.id"
                            :color="isRocketFavorited(launch.rocket.rocket.id) ? 'red' : 'grey'"
                            :variant="isRocketFavorited(launch.rocket.rocket.id) ? 'elevated' : 'outlined'"
                            size="x-small"
                            icon
                            @click.stop="toggleRocketFavorite(launch)"
                          >
                            <v-icon 
                              :icon="isRocketFavorited(launch.rocket.rocket.id) ? 'mdi-heart' : 'mdi-heart-outline'"
                              size="small"
                            />
                          </v-btn>
                        </div>
                        <p class="text-body-2 mb-2 font-weight-medium">
                          {{ launch.rocket?.rocket_name || 'Unknown Rocket' }}
                        </p>
                        <!-- Rocket Details Button -->
                        <v-btn
                          v-if="launch.rocket?.rocket?.id"
                          :to="`/rockets/${launch.rocket.rocket.id}`"
                          variant="outlined"
                          size="small"
                          color="orange"
                          prepend-icon="mdi-information"
                          class="text-none"
                          block
                        >
                          View Rocket Details
                        </v-btn>
                        <div v-else class="text-caption text-medium-emphasis text-center pa-2">
                          Rocket details unavailable
                        </div>
                      </v-card-text>
                    </v-card>

                    <!-- Mission Details Card -->
                    <v-card 
                      variant="tonal" 
                      :color="launch.details ? 'success' : 'grey'" 
                      class="info-card mission-details-card"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon 
                            :icon="launch.details ? 'mdi-information' : 'mdi-information-off'"
                            :color="launch.details ? 'success' : 'grey'" 
                            class="mr-2" 
                          />
                          <span 
                            class="text-subtitle-2 font-weight-bold"
                            :class="launch.details ? 'text-success' : 'text-grey'"
                          >
                            Mission Details
                          </span>
                        </div>
                        <div v-if="launch.details" class="mission-details-content">
                          <p class="text-body-2 text-high-emphasis">
                            {{ launch.details }}
                          </p>
                        </div>
                        <div v-else class="text-center pa-2">
                          <p class="text-caption text-medium-emphasis">
                            No mission details available
                          </p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </AppCard>
              </v-col>
            </transition-group>

            <!-- Pagination Controls -->
            <div class="pagination-container">
              <!-- Main Pagination Component -->
              <div class="d-flex justify-center mb-4">
                <v-pagination
                  v-model="currentPage"
                  :length="paginationResult.totalPages"
                  :total-visible="7"
                  @update:model-value="goToPage"
                  color="primary"
                  variant="outlined"
                  size="default"
                  class="pagination-main"
                />
              </div>

              <!-- Pagination Info and Controls Row -->
              <div class="pagination-info-row">
                <!-- Page Info -->
                <div class="pagination-info">
                  <v-chip
                    color="primary"
                    variant="flat"
                    size="small"
                    class="pagination-chip"
                  >
                    <v-icon icon="mdi-page-layout-header" size="small" class="mr-1" />
                    Page {{ paginationResult.currentPage }} of {{ paginationResult.totalPages }}
                  </v-chip>
                  <v-chip
                    color="info"
                    variant="flat"
                    size="small"
                    class="pagination-chip"
                  >
                    <v-icon icon="mdi-counter" size="small" class="mr-1" />
                    {{ paginationResult.startItem }}-{{ paginationResult.endItem }} of {{ paginationResult.totalItems }}
                  </v-chip>
                </div>

                <!-- Items per page selector -->
                <div class="items-per-page">
                  <v-select
                    v-model="pageSize"
                    :items="[6, 12, 24, 48]"
                    label="Items per page"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="page-size-select"
                    @update:model-value="setPageSize"
                  />
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="pagination-nav-buttons">
                <v-btn-group divided class="pagination-btn-group">
                  <v-btn
                    variant="outlined"
                    size="small"
                    :disabled="!hasPreviousPage"
                    @click="firstPage"
                    class="nav-btn"
                  >
                    <v-icon icon="mdi-page-first" size="small" />
                    <span class="btn-text">First</span>
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    size="small"
                    :disabled="!hasPreviousPage"
                    @click="previousPage"
                    class="nav-btn"
                  >
                    <v-icon icon="mdi-chevron-left" size="small" />
                    <span class="btn-text">Previous</span>
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    size="small"
                    :disabled="!hasNextPage"
                    @click="nextPage"
                    class="nav-btn"
                  >
                    <span class="btn-text">Next</span>
                    <v-icon icon="mdi-chevron-right" size="small" />
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    size="small"
                    :disabled="!hasNextPage"
                    @click="lastPage"
                    class="nav-btn"
                  >
                    <span class="btn-text">Last</span>
                    <v-icon icon="mdi-page-last" size="small" />
                  </v-btn>
                </v-btn-group>
              </div>
            </div>
          </div>

          <!-- No filtered results -->
          <v-alert
            v-else
            type="warning"
            variant="tonal"
            class="text-center"
          >
            <v-alert-title>No Launches Found for {{ selectedYear }}</v-alert-title>
            <p class="mt-2">No SpaceX launches found for the year {{ selectedYear }}.</p>
            <v-btn
              variant="outlined"
              class="mt-3"
              @click="clearFiltersAndReset"
            >
              Clear Filter
            </v-btn>
          </v-alert>
        </div>        <!-- No launches states -->
        <v-alert
          v-else
          type="info"
          variant="tonal"
          class="text-center"
        >
          <v-alert-title>No Launches Found</v-alert-title>
          No SpaceX launches are currently available.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Launch } from '~/composables/types'

definePageMeta({
  title: 'SpaceX Launches',
  description: 'View all SpaceX launches with mission details, launch dates, sites, and rockets'
})

// GraphQL query to fetch launches
const query = gql`
  query getLaunches {
    launches {
      id
      mission_name
      launch_date_local
      launch_date_unix
      launch_date_utc
      launch_site {
        site_id
        site_name
        site_name_long
      }
      rocket {
        rocket_name
        rocket {
          id
        }
      }
      details
    }
  }
`

// Execute the query using Nuxt Apollo
const { data, status, error } = await useAsyncQuery<{
  launches: Launch[]
}>(query)

// Computed property to get launches array with proper typing
const launches = computed(() => (data.value?.launches ?? []) as Launch[])

// Computed property for loading state
const pending = computed(() => status.value === 'pending')

// Initialize favorites store
const favoritesStore = useFavorites()

// Use the sorting composable
const {
  sortedLaunches,
  sortOrder,
  setSortOrder,
  toggleSortOrder
} = useLaunchSorting(launches)

// Use the filtering composable with sorted launches
const {
  filteredLaunches,
  selectedYear,
  availableYears,
  hasActiveFilter,
  filterStats,
  filterByYear,
  clearAllFilters
} = useLaunchFiltering(sortedLaunches)

// Use the pagination composable with filtered launches
const {
  paginatedLaunches,
  paginationResult,
  currentPage,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  goToPage,
  nextPage,
  previousPage,
  firstPage,
  lastPage,
  setPageSize,
  resetPagination
} = useLaunchPagination(computed(() => [...filteredLaunches.value]))

// Computed property for select component items
const yearFilterItems = computed(() => {
  return availableYears.map((year: string) => ({
    title: `${year} (${launches.value.filter(l => 
      l.launch_date_local && new Date(l.launch_date_local).getFullYear().toString() === year
    ).length} launches)`,
    value: year
  }))
})

// Use shared date formatting utility
const { formatLaunchDate } = useDateFormatting()

// Utility function to format launch date
const formatLaunchDateUtil = (dateString: string): string => {
  return formatLaunchDate(dateString, 'Unknown')
}

// Utility function to clear filters and reset pagination
const clearFiltersAndReset = () => {
  clearAllFilters()
  resetPagination()
}

// Favorites helper functions
const isRocketFavorited = (rocketId: string): boolean => {
  return favoritesStore.isFavorite(rocketId)
}

const toggleRocketFavorite = async (launch: Launch) => {
  if (!launch.rocket?.rocket?.id) return
  
  // We need to fetch the full rocket data to add to favorites
  // For now, we'll create a minimal rocket object from launch data
  const rocketData = {
    id: launch.rocket.rocket.id,
    name: launch.rocket.rocket_name || 'Unknown Rocket',
    description: null,
    first_flight: null,
    height: null,
    diameter: null,
    mass: null,
    stages: null,
    active: true, // Default assumption
    company: 'SpaceX',
    country: 'United States',
    cost_per_launch: null,
    success_rate_pct: null,
    wikipedia: null,
    boosters: null,
    engines: null,
    landing_legs: null,
    payload_weights: null,
    second_stage: null,
    type: null
  } as Rocket
  
  favoritesStore.toggleFavorite(rocketData)
}

// SEO optimization
useHead({
  title: 'SpaceX Launches',
  meta: [
    {
      name: 'description',
      content: 'Browse all SpaceX launches with detailed information including mission names, launch dates, sites, rockets, and mission details.'
    },
    {
      property: 'og:title',
      content: 'SpaceX Launches - Mission Database'
    },
    {
      property: 'og:description',
      content: 'Comprehensive database of SpaceX launches with mission details, dates, and rocket information.'
    }
  ]
})
</script>

<style scoped>
/* CSS Custom Properties for consistent theming */
.launch-page {
  --card-radius: 8px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-card: 0 12px 40px rgba(0, 0, 0, 0.15);
  --transition-fast: 0.2s ease-in-out;
  --transition-normal: 0.3s ease-out;
  --transition-slow: 0.5s ease;
}

/* Launch Cards */
.launch-card {
  height: 100%;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.launch-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card) !important;
}

/* Launch Information Grid */
.launch-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .launch-info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Info Cards */
.info-card {
  transition: transform var(--transition-fast);
  border-radius: var(--card-radius) !important;
}

.info-card:hover {
  transform: translateY(-2px);
}

/* Full-width cards on larger screens */
.rocket-card,
.mission-details-card {
  grid-column: 1 / -1;
}

/* Mission Details Content */
.mission-details-content {
  max-height: 120px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom Scrollbar */
.mission-details-content::-webkit-scrollbar,
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.mission-details-content::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.mission-details-content::-webkit-scrollbar-thumb,
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.mission-details-content::-webkit-scrollbar-thumb:hover,
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Grid Animations */
.launch-grid-move,
.launch-grid-enter-active,
.launch-grid-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.launch-grid-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.launch-grid-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.launch-grid-leave-active {
  position: absolute;
  width: 100%;
}

.launch-item {
  position: relative;
}

/* Enhanced Hover Effects */
.info-card .v-card-text {
  position: relative;
  overflow: hidden;
}

.info-card .v-card-text::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left var(--transition-slow);
}

.info-card:hover .v-card-text::before {
  left: 100%;
}

/* Animations */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--v-theme-warning), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0); }
}

@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.v-chip.filter-active { animation: pulse 2s infinite; }
.launch-card .v-chip { animation: fadeInScale var(--transition-normal); }

/* Responsive Behavior */
@media (max-width: 767px) {
  .launch-info-grid {
    grid-template-columns: 1fr;
  }

  .rocket-card,
  .mission-details-card {
    grid-column: 1;
  }
}

/* Dark Theme Adjustments */
.v-theme--dark .info-card .v-card-text::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
}

/* Accessibility */
.info-card:focus-within {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.launch-item.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* ===== PAGINATION STYLES ===== */
.pagination-container {
  margin: 2rem 0;
}

.pagination-main {
  border-radius: var(--card-radius) !important;
  box-shadow: var(--shadow-light);
}

.pagination-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pagination-chip {
  font-weight: 500;
  border-radius: 6px;
}

.items-per-page {
  display: flex;
  align-items: center;
}

.page-size-select {
  min-width: 140px;
  border-radius: 6px;
}

.pagination-nav-buttons {
  display: flex;
  justify-content: center;
}

.pagination-btn-group {
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.nav-btn {
  border-radius: 0 !important;
  font-weight: 500;
  min-width: 100px;
  transition: all var(--transition-fast);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-text {
  margin: 0 4px;
}

/* Responsive Pagination */
@media (max-width: 768px) {
  .pagination-info-row {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-info,
  .items-per-page {
    justify-content: center;
  }

  .nav-btn {
    min-width: 80px;
  }

  .btn-text {
    display: none;
  }

  .nav-btn .v-icon {
    margin: 0;
  }
}

@media (max-width: 480px) {
  .pagination-main {
    transform: scale(0.9);
  }

  .pagination-btn-group .v-btn {
    padding: 0 8px;
  }
}
</style>

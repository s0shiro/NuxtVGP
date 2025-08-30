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
                    :model-value="selectedYear"
                    @update:model-value="filterByYear"
                    :items="yearFilterItems"
                    label="Filter by Launch Year"
                    variant="outlined"
                    clearable
                    prepend-inner-icon="mdi-calendar"
                    hint="Select a year to filter launches"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :model-value="sortOrder"
                    @update:model-value="setSortOrder"
                    :items="[
                      { title: 'Oldest First', value: 'asc' },
                      { title: 'Newest First', value: 'desc' }
                    ]"
                    label="Sort by Launch Date"
                    variant="outlined"
                    prepend-inner-icon="mdi-sort-calendar-ascending"
                    hint="Sort launches by date"
                    persistent-hint
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
                      @click="clearAllFilters"
                    >
                      Clear All Filters
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Filter Statistics -->
          <div class="d-flex flex-wrap gap-2 mb-6">
            <v-chip color="primary" variant="elevated">
              <v-icon icon="mdi-rocket-launch" class="mr-1" />
              Total: {{ filterStats.total }}
            </v-chip>
            <v-chip 
              :color="hasActiveFilter ? 'success' : 'primary'" 
              variant="elevated"
            >
              <v-icon icon="mdi-eye" class="mr-1" />
              Showing: {{ filterStats.filtered }}
            </v-chip>
            <v-chip
              v-if="filterStats.hasFilter && filterStats.hiddenCount > 0"
              color="orange"
              variant="elevated"
            >
              <v-icon icon="mdi-eye-off" class="mr-1" />
              Hidden: {{ filterStats.hiddenCount }}
            </v-chip>
          </div>

          <!-- Launches Grid or No Results -->
          <div v-if="filteredLaunches.length > 0">
            <transition-group name="launch-grid" tag="div" class="v-row">
              <v-col
                v-for="launch in filteredLaunches"
                :key="launch.id"
                cols="12"
                md="6"
                lg="4"
                class="launch-item"
              >
                <v-card
                  class="launch-card mb-4"
                  elevation="2"
                  hover
                >
                  <v-card-title class="text-wrap">
                    <v-icon icon="mdi-rocket" class="mr-2" />
                    {{ launch.mission_name }}
                  </v-card-title>
                  
                  <v-card-text>
                    <div class="launch-details">
                      <!-- Launch Date -->
                      <div class="detail-item mb-3">
                        <v-chip
                          size="small"
                          variant="outlined"
                          prepend-icon="mdi-calendar"
                          class="mb-2"
                        >
                          Launch Date
                        </v-chip>
                        <p class="text-body-2 ml-2">
                          {{ formatLaunchDate(launch.launch_date_local) }}
                        </p>
                      </div>

                      <!-- Launch Site -->
                      <div class="detail-item mb-3">
                        <v-chip
                          size="small"
                          variant="outlined"
                          prepend-icon="mdi-map-marker"
                          class="mb-2"
                          color="blue"
                        >
                          Launch Site
                        </v-chip>
                        <p class="text-body-2 ml-2">
                          {{ launch.launch_site?.site_name || 'Unknown' }}
                        </p>
                        <p v-if="launch.launch_site?.site_name_long" class="text-caption text-medium-emphasis ml-2">
                          {{ launch.launch_site.site_name_long }}
                        </p>
                      </div>

                      <!-- Rocket Name -->
                      <div class="detail-item mb-3">
                        <v-chip
                          size="small"
                          variant="outlined"
                          prepend-icon="mdi-rocket-launch-outline"
                          class="mb-2"
                          color="orange"
                        >
                          Rocket
                        </v-chip>
                        <div class="d-flex align-center justify-space-between ml-2">
                          <p class="text-body-2">
                            {{ launch.rocket?.rocket_name || 'Unknown' }}
                          </p>
                          <v-btn
                            v-if="launch.rocket?.rocket?.id"
                            :to="`/rockets/${launch.rocket.rocket.id}`"
                            variant="text"
                            size="small"
                            color="orange"
                            prepend-icon="mdi-information"
                            class="ml-2"
                          >
                            Details
                          </v-btn>
                        </div>
                      </div>

                      <!-- Details -->
                      <div v-if="launch.details" class="detail-item">
                        <v-chip
                          size="small"
                          variant="outlined"
                          prepend-icon="mdi-information"
                          class="mb-2"
                          color="green"
                        >
                          Details
                        </v-chip>
                        <p class="text-body-2 ml-2">
                          {{ launch.details }}
                        </p>
                      </div>
                      
                      <div v-else class="detail-item">
                        <v-chip
                          size="small"
                          variant="outlined"
                          prepend-icon="mdi-information-off"
                          class="mb-2"
                          color="grey"
                        >
                          No Details Available
                        </v-chip>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </transition-group>
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
              @click="clearAllFilters"
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

// Define the page metadata
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

// Computed property for select component items
const yearFilterItems = computed(() => {
  return availableYears.map((year: string) => ({
    title: `${year} (${launches.value.filter(l => 
      l.launch_date_local && new Date(l.launch_date_local).getFullYear().toString() === year
    ).length} launches)`,
    value: year
  }))
})

// Utility function to format launch date
const formatLaunchDate = (dateString: string): string => {
  if (!dateString) return 'Unknown'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch (error) {
    return 'Invalid Date'
  }
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
.launch-card {
  transition: transform 0.2s ease-in-out;
}

.launch-card:hover {
  transform: translateY(-2px);
}

.detail-item {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.2);
  padding-left: 12px;
}

.launch-details {
  max-height: 400px;
  overflow-y: auto;
}

/* Transition animations for filtering */
.launch-grid-move,
.launch-grid-enter-active,
.launch-grid-leave-active {
  transition: all 0.3s ease;
}

.launch-grid-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.launch-grid-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.launch-grid-leave-active {
  position: absolute;
  width: 100%;
}

.launch-item {
  position: relative;
}

/* Smooth filtering feedback */
.v-chip.filter-active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-warning), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0);
  }
}
</style>

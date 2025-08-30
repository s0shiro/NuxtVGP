<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">
          <v-icon icon="mdi-rocket" class="mr-3" />
          SpaceX Rockets
        </h1>
        
        <!-- Navigation -->
        <div class="mb-6">
          <v-btn
            to="/launches"
            variant="outlined"
            prepend-icon="mdi-rocket-launch"
            class="mr-2"
          >
            View Launches
          </v-btn>
        </div>

        <!-- Loading state -->
        <div v-if="pending" class="text-center py-12">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          />
          <p class="mt-4 text-h6">Loading rockets...</p>
        </div>

        <!-- Error state -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="mb-6"
        >
          <v-alert-title>Error Loading Rockets</v-alert-title>
          {{ error.message }}
        </v-alert>

        <!-- Success state - Display rockets -->
        <div v-else-if="rockets && rockets.length > 0">
          <v-row>
            <v-col
              v-for="rocket in rockets"
              :key="rocket.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card
                class="rocket-card mb-4"
                elevation="2"
                hover
                :to="`/rockets/${rocket.id}`"
              >
                <v-card-title class="text-wrap">
                  <div class="d-flex align-center justify-space-between">
                    <span>
                      <v-icon icon="mdi-rocket" class="mr-2" />
                      {{ rocket.name }}
                    </span>
                    <v-chip
                      :color="rocket.active ? 'success' : 'error'"
                      size="small"
                      variant="elevated"
                    >
                      {{ rocket.active ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </div>
                </v-card-title>
                
                <v-card-text>
                  <div class="rocket-details">
                    <!-- Description -->
                    <div class="detail-item mb-3">
                      <v-chip
                        size="small"
                        variant="outlined"
                        prepend-icon="mdi-text"
                        class="mb-2"
                      >
                        Description
                      </v-chip>
                      <p class="text-body-2 ml-2">
                        {{ truncateText(rocket.description, 100) || 'No description available' }}
                      </p>
                    </div>

                    <!-- First Flight -->
                    <div class="detail-item mb-3" v-if="rocket.first_flight">
                      <v-chip
                        size="small"
                        variant="outlined"
                        prepend-icon="mdi-calendar-star"
                        class="mb-2"
                        color="orange"
                      >
                        First Flight
                      </v-chip>
                      <p class="text-body-2 ml-2">
                        {{ formatDate(rocket.first_flight) }}
                      </p>
                    </div>

                    <!-- Height -->
                    <div class="detail-item mb-3" v-if="rocket.height">
                      <v-chip
                        size="small"
                        variant="outlined"
                        prepend-icon="mdi-arrow-up-down"
                        class="mb-2"
                        color="blue"
                      >
                        Height
                      </v-chip>
                      <p class="text-body-2 ml-2">
                        {{ rocket.height.meters }} m ({{ rocket.height.feet }} ft)
                      </p>
                    </div>

                    <!-- Stages -->
                    <div class="detail-item mb-3" v-if="rocket.stages">
                      <v-chip
                        size="small"
                        variant="outlined"
                        prepend-icon="mdi-layers-triple"
                        class="mb-2"
                        color="indigo"
                      >
                        Stages
                      </v-chip>
                      <p class="text-body-2 ml-2">
                        {{ rocket.stages }}
                      </p>
                    </div>

                    <!-- Success Rate -->
                    <div class="detail-item" v-if="rocket.success_rate_pct !== null">
                      <v-chip
                        size="small"
                        variant="outlined"
                        prepend-icon="mdi-target"
                        class="mb-2"
                        color="success"
                      >
                        Success Rate
                      </v-chip>
                      <p class="text-body-2 ml-2">
                        {{ rocket.success_rate_pct }}%
                      </p>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :to="`/rockets/${rocket.id}`"
                    variant="outlined"
                    color="primary"
                    prepend-icon="mdi-information"
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- No rockets state -->
        <v-alert
          v-else
          type="info"
          variant="tonal"
          class="text-center"
        >
          <v-alert-title>No Rockets Found</v-alert-title>
          No SpaceX rockets are currently available.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Distance } from '~/composables/types'

// Define page metadata
definePageMeta({
  title: 'SpaceX Rockets',
  description: 'Browse all SpaceX rockets with detailed specifications and information'
})

// Define TypeScript interface for rockets list (simplified version)
interface RocketSummary {
  id: string
  name: string
  description: string | null
  first_flight: string | null
  height: Distance | null
  stages: number | null
  active: boolean
  success_rate_pct: number | null
}

// GraphQL query to fetch rockets
const query = gql`
  query getRockets {
    rockets {
      id
      name
      description
      first_flight
      height {
        feet
        meters
      }
      stages
      active
      success_rate_pct
    }
  }
`

// Execute the query
const { data, status, error } = await useAsyncQuery<{
  rockets: RocketSummary[]
}>(query)

// Computed property to get rockets array
const rockets = computed(() => (data.value?.rockets ?? []) as RocketSummary[])

// Computed property for loading state
const pending = computed(() => status.value === 'pending')

// Utility functions
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Unknown'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const truncateText = (text: string | null, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// SEO optimization
useHead({
  title: 'SpaceX Rockets',
  meta: [
    {
      name: 'description',
      content: 'Browse all SpaceX rockets with detailed specifications, performance data, and technical information.'
    },
    {
      property: 'og:title',
      content: 'SpaceX Rockets - Complete Database'
    },
    {
      property: 'og:description',
      content: 'Comprehensive database of SpaceX rockets with specifications, performance data, and detailed information.'
    }
  ]
})
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease-in-out;
}

.rocket-card:hover {
  transform: translateY(-2px);
}

.detail-item {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.2);
  padding-left: 12px;
}

.rocket-details {
  max-height: 400px;
  overflow-y: auto;
}
</style>

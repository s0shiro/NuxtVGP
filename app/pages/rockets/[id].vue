<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Navigation -->
        <div class="mb-6">
          <v-btn
            to="/rockets"
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            class="mb-4"
          >
            Back to Rockets
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
          <p class="mt-4 text-h6">Loading rocket details...</p>
        </div>

        <!-- Error state -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="mb-6"
        >
          <v-alert-title>Error Loading Rocket Details</v-alert-title>
          {{ error.message }}
        </v-alert>

        <!-- Success state - Display rocket details -->
        <div v-else-if="rocket">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-h3 mb-2">
              <v-icon icon="mdi-rocket" class="mr-3" />
              {{ rocket.name }}
            </h1>
            <v-chip
              :color="rocket.active ? 'success' : 'error'"
              variant="elevated"
              prepend-icon="mdi-circle"
              class="mb-4"
            >
              {{ rocket.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>

          <!-- Main Content Grid -->
          <v-row>
            <!-- Left Column - Basic Info -->
            <v-col cols="12" lg="6">
              <v-card elevation="2" class="mb-6">
                <v-card-title>
                  <v-icon icon="mdi-information" class="mr-2" />
                  Basic Information
                </v-card-title>
                <v-card-text>
                  <v-list lines="two">
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-text" color="blue" />
                      </template>
                      <v-list-item-title>Description</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ rocket.description || 'No description available' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-divider />
                    
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-calendar-star" color="orange" />
                      </template>
                      <v-list-item-title>First Flight</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ formatDate(rocket.first_flight) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-divider />
                    
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-factory" color="purple" />
                      </template>
                      <v-list-item-title>Company</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ rocket.company || 'N/A' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-divider />
                    
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-flag" color="green" />
                      </template>
                      <v-list-item-title>Country</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ rocket.country || 'N/A' }}
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-divider />
                    
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-layers-triple" color="indigo" />
                      </template>
                      <v-list-item-title>Number of Stages</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ rocket.stages || 'N/A' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Right Column - Specifications -->
            <v-col cols="12" lg="6">
              <v-card elevation="2" class="mb-6">
                <v-card-title>
                  <v-icon icon="mdi-ruler" class="mr-2" />
                  Physical Specifications
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <!-- Height -->
                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4 text-center">
                        <v-icon icon="mdi-arrow-up-down" size="36" color="blue" class="mb-2" />
                        <h3 class="text-h6 mb-2">Height</h3>
                        <div v-if="rocket.height">
                          <p class="text-body-1 mb-1">{{ rocket.height.meters }} m</p>
                          <p class="text-body-2 text-medium-emphasis">{{ rocket.height.feet }} ft</p>
                        </div>
                        <p v-else class="text-body-2 text-medium-emphasis">N/A</p>
                      </v-card>
                    </v-col>

                    <!-- Diameter -->
                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="pa-4 text-center">
                        <v-icon icon="mdi-circle-outline" size="36" color="orange" class="mb-2" />
                        <h3 class="text-h6 mb-2">Diameter</h3>
                        <div v-if="rocket.diameter">
                          <p class="text-body-1 mb-1">{{ rocket.diameter.meters }} m</p>
                          <p class="text-body-2 text-medium-emphasis">{{ rocket.diameter.feet }} ft</p>
                        </div>
                        <p v-else class="text-body-2 text-medium-emphasis">N/A</p>
                      </v-card>
                    </v-col>

                    <!-- Mass -->
                    <v-col cols="12">
                      <v-card variant="outlined" class="pa-4 text-center">
                        <v-icon icon="mdi-weight" size="36" color="green" class="mb-2" />
                        <h3 class="text-h6 mb-2">Mass</h3>
                        <div v-if="rocket.mass">
                          <p class="text-body-1 mb-1">{{ formatNumber(rocket.mass.kg) }} kg</p>
                          <p class="text-body-2 text-medium-emphasis">{{ formatNumber(rocket.mass.lb) }} lb</p>
                        </div>
                        <p v-else class="text-body-2 text-medium-emphasis">N/A</p>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Additional Information -->
            <v-col cols="12" v-if="rocket.cost_per_launch || rocket.success_rate_pct">
              <v-card elevation="2">
                <v-card-title>
                  <v-icon icon="mdi-chart-line" class="mr-2" />
                  Performance & Economics
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6" v-if="rocket.cost_per_launch">
                      <v-card variant="outlined" class="pa-4 text-center">
                        <v-icon icon="mdi-currency-usd" size="36" color="purple" class="mb-2" />
                        <h3 class="text-h6 mb-2">Cost per Launch</h3>
                        <p class="text-h5 text-primary">{{ formatCurrency(rocket.cost_per_launch) }}</p>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="6" v-if="rocket.success_rate_pct !== null">
                      <v-card variant="outlined" class="pa-4 text-center">
                        <v-icon icon="mdi-target" size="36" color="success" class="mb-2" />
                        <h3 class="text-h6 mb-2">Success Rate</h3>
                        <p class="text-h5 text-success">{{ rocket.success_rate_pct }}%</p>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- External Links -->
            <v-col cols="12" v-if="rocket.wikipedia">
              <v-card elevation="2">
                <v-card-title>
                  <v-icon icon="mdi-link" class="mr-2" />
                  External Resources
                </v-card-title>
                <v-card-text>
                  <v-btn
                    v-if="rocket.wikipedia"
                    :href="rocket.wikipedia"
                    target="_blank"
                    variant="outlined"
                    prepend-icon="mdi-wikipedia"
                    class="mr-2"
                  >
                    Wikipedia Article
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Not found state -->
        <v-alert
          v-else
          type="warning"
          variant="tonal"
          class="text-center"
        >
          <v-alert-title>Rocket Not Found</v-alert-title>
          <p class="mt-2">The requested rocket could not be found.</p>
          <v-btn
            to="/launches"
            variant="outlined"
            class="mt-3"
          >
            Return to Launches
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Rocket } from '~/composables/types'

// Define page metadata
definePageMeta({
  title: 'Rocket Details',
  description: 'Detailed information about SpaceX rockets'
})

// Get the rocket ID from the route
const route = useRoute()
const rocketId = route.params.id as string

// GraphQL query to fetch rocket details
const query = gql`
  query getRocket($rocketId: ID!) {
    rocket(id: $rocketId) {
      id
      name
      description
      first_flight
      height {
        feet
        meters
      }
      diameter {
        feet
        meters
      }
      mass {
        kg
        lb
      }
      stages
      active
      company
      country
      cost_per_launch
      success_rate_pct
      wikipedia
    }
  }
`

// Execute the query
const { data, status, error } = await useAsyncQuery<{
  rocket: Rocket
}>(query, {
  rocketId
})

// Computed property to get rocket data
const rocket = computed(() => data.value?.rocket ?? null)

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

const formatNumber = (num: number | null): string => {
  if (num === null || num === undefined) return 'N/A'
  return num.toLocaleString()
}

const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

// SEO optimization
useHead({
  title: computed(() => rocket.value ? `${rocket.value.name} - Rocket Details` : 'Rocket Details'),
  meta: [
    {
      name: 'description',
      content: computed(() => 
        rocket.value 
          ? `Detailed information about the ${rocket.value.name} rocket including specifications, performance data, and technical details.`
          : 'Detailed information about SpaceX rockets including specifications and performance data.'
      )
    },
    {
      property: 'og:title',
      content: computed(() => rocket.value ? `${rocket.value.name} - SpaceX Rocket` : 'SpaceX Rocket Details')
    },
    {
      property: 'og:description',
      content: computed(() => 
        rocket.value?.description || 'Detailed information about SpaceX rockets.'
      )
    }
  ]
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>

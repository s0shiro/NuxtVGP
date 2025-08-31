<template>
  <div>
    <v-card v-if="rockets.length === 0" variant="outlined" class="text-center pa-6">
      <v-icon icon="mdi-rocket-launch-outline" size="64" class="mb-4 text-medium-emphasis" />
      <h3 class="text-h5 mb-2">No Rockets Selected</h3>
      <p class="text-medium-emphasis mb-4">Select rockets to compare their specifications side by side.</p>
      <v-btn 
        to="/rockets" 
        variant="outlined" 
        color="primary" 
        prepend-icon="mdi-rocket"
      >
        Browse Rockets
      </v-btn>
    </v-card>

    <div v-else class="rocket-comparison-container">
      <!-- Comparison Table -->
      <v-card variant="outlined" elevation="2" class="rocket-comparison-card">
        <v-table class="comparison-table" density="comfortable">
          <thead>
            <tr>
              <th class="feature-column text-center">
                <div class="d-flex flex-column align-center justify-center comparison-header">
                  <span class="text-h6">Feature</span>
                </div>
              </th>
              <th v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <div class="d-flex flex-column align-center comparison-header">
                  <v-avatar 
                    color="primary" 
                    class="mb-2 white--text"
                    size="48"
                  >
                    <v-icon icon="mdi-rocket" size="24" />
                  </v-avatar>
                  <span class="text-h6">{{ rocket.name }}</span>
                  <v-chip
                    :color="rocket.active ? 'success' : 'error'"
                    size="small"
                    variant="elevated"
                    class="mt-2"
                  >
                    {{ rocket.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Basic Information -->
            <tr class="section-header">
              <td colspan="100%" class="text-primary">Basic Information</td>
            </tr>
            <tr>
              <td class="feature-name text-center">
                <v-tooltip text="Company that manufactures the rocket">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center justify-center" v-bind="props">
                      <v-icon icon="mdi-factory" class="mr-2" color="blue" size="small" />
                      Company
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.company || 'N/A' }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Country of origin">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-flag" class="mr-2" color="green" size="small" />
                      Country
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.country || 'N/A' }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Date of first launch">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-calendar-star" class="mr-2" color="orange" size="small" />
                      First Flight
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ formatDate(rocket.first_flight) }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Success rate percentage">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-target" class="mr-2" color="success" size="small" />
                      Success Rate
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <template v-if="rocket.success_rate_pct !== null">
                  <v-progress-circular
                    :model-value="rocket.success_rate_pct"
                    :color="getSuccessRateColor(rocket.success_rate_pct)"
                    :size="50"
                  >
                    {{ rocket.success_rate_pct }}%
                  </v-progress-circular>
                </template>
                <span v-else>N/A</span>
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Cost per launch in USD">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-currency-usd" class="mr-2" color="purple" size="small" />
                      Cost per Launch
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ formatCurrency(rocket.cost_per_launch) }}
              </td>
            </tr>

            <!-- Physical Specifications -->
            <tr class="section-header">
              <td colspan="100%" class="text-primary">Physical Specifications</td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Height in meters and feet">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-arrow-up-down" class="mr-2" color="blue" size="small" />
                      Height
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <template v-if="rocket.height">
                  <div>{{ rocket.height.meters }} m</div>
                  <div class="text-caption text-medium-emphasis">{{ rocket.height.feet }} ft</div>
                </template>
                <span v-else>N/A</span>
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Diameter in meters and feet">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-circle-outline" class="mr-2" color="orange" size="small" />
                      Diameter
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <template v-if="rocket.diameter">
                  <div>{{ rocket.diameter.meters }} m</div>
                  <div class="text-caption text-medium-emphasis">{{ rocket.diameter.feet }} ft</div>
                </template>
                <span v-else>N/A</span>
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Mass in kilograms and pounds">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-weight" class="mr-2" color="green" size="small" />
                      Mass
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <template v-if="rocket.mass">
                  <div>{{ formatNumber(rocket.mass.kg) }} kg</div>
                  <div class="text-caption text-medium-emphasis">{{ formatNumber(rocket.mass.lb) }} lb</div>
                </template>
                <span v-else>N/A</span>
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Number of stages">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-layers-triple" class="mr-2" color="indigo" size="small" />
                      Stages
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.stages || 'N/A' }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Number of boosters">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-rocket-launch" class="mr-2" color="deep-orange" size="small" />
                      Boosters
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.boosters || 'N/A' }}
              </td>
            </tr>

            <!-- Engine Information -->
            <tr class="section-header">
              <td colspan="100%" class="text-primary">Engine Information</td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Number of engines">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-engine" class="mr-2" color="red" size="small" />
                      Number of Engines
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.engines?.number || 'N/A' }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Engine type">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-cog" class="mr-2" color="blue-grey" size="small" />
                      Engine Type
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.engines?.type || 'N/A' }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Engine version">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-label" class="mr-2" color="teal" size="small" />
                      Engine Version
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.engines?.version || 'N/A' }}
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Engine propellants">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-chemical-weapon" class="mr-2" color="amber" size="small" />
                      Propellants
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <template v-if="rocket.engines?.propellant_1 || rocket.engines?.propellant_2">
                  {{ rocket.engines.propellant_1 || 'N/A' }} / {{ rocket.engines.propellant_2 || 'N/A' }}
                </template>
                <span v-else>N/A</span>
              </td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Engine thrust to weight ratio">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-scale-balance" class="mr-2" color="deep-purple" size="small" />
                      Thrust to Weight
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                {{ rocket.engines?.thrust_to_weight || 'N/A' }}
              </td>
            </tr>

            <!-- Payload Capacity -->
            <tr class="section-header">
              <td colspan="100%" class="text-primary">Payload Capacity</td>
            </tr>
            <tr v-for="(_, index) in getMaxPayloadTypes()" :key="`payload-${index}`">
              <td class="feature-name">
                <v-tooltip :text="`Payload capacity for ${getPayloadTypeAtIndex(index)}`">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-package-variant-closed" class="mr-2" color="brown" size="small" />
                      {{ getPayloadTypeAtIndex(index) }}
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="`${rocket.id}-payload-${index}`" class="text-center">
                <template v-if="getPayloadByTypeIndex(rocket, index)">
                  <div>{{ formatNumber(getPayloadByTypeIndex(rocket, index)?.kg) }} kg</div>
                  <div class="text-caption text-medium-emphasis">{{ formatNumber(getPayloadByTypeIndex(rocket, index)?.lb) }} lb</div>
                </template>
                <span v-else>N/A</span>
              </td>
            </tr>

            <!-- External Links -->
            <tr class="section-header">
              <td colspan="100%" class="text-primary">External Links</td>
            </tr>
            <tr>
              <td class="feature-name">
                <v-tooltip text="Wikipedia article">
                  <template v-slot:activator="{ props }">
                    <div class="d-flex align-center" v-bind="props">
                      <v-icon icon="mdi-wikipedia" class="mr-2" color="blue-grey" size="small" />
                      Wikipedia
                    </div>
                  </template>
                </v-tooltip>
              </td>
              <td v-for="rocket in rockets" :key="rocket.id" class="text-center">
                <v-btn
                  v-if="rocket.wikipedia"
                  :href="rocket.wikipedia"
                  target="_blank"
                  variant="text"
                  size="small"
                  icon="mdi-open-in-new"
                  color="primary"
                >
                  View
                </v-btn>
                <span v-else>N/A</span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Rocket } from '~/composables/types'

// Define props
const props = defineProps<{
  rockets: Rocket[]
}>()

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

const formatNumber = (num: number | null | undefined): string => {
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

const getSuccessRateColor = (rate: number | null): string => {
  if (rate === null) return 'grey'
  if (rate >= 90) return 'success'
  if (rate >= 70) return 'warning'
  return 'error'
}

// Payload helper functions
const getMaxPayloadTypes = () => {
  let maxTypes = 0
  for (const rocket of props.rockets) {
    if (rocket.payload_weights && rocket.payload_weights.length > maxTypes) {
      maxTypes = rocket.payload_weights.length
    }
  }
  return Array(maxTypes).fill(null)
}

const getPayloadTypeAtIndex = (index: number) => {
  for (const rocket of props.rockets) {
    if (rocket.payload_weights && rocket.payload_weights[index]) {
      return rocket.payload_weights[index].name
    }
  }
  return `Payload Type ${index + 1}`
}

const getPayloadByTypeIndex = (rocket: Rocket, index: number) => {
  if (!rocket.payload_weights) return null
  return rocket.payload_weights[index] || null
}
</script>

<style scoped>
/* Table Structure */
.comparison-table {
  border-collapse: separate;
  border-spacing: 0;
}

/* Card styling */
.rocket-comparison-card {
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 24px;
}

/* Header Elements */
.comparison-header {
  padding: 16px 8px;
  height: 100%;
  min-height: 130px;
}

.feature-column {
  width: 200px;
}

/* Feature name cells */
.feature-name {
  font-weight: 500;
}

.v-tooltip {
  display: block;
}

/* Row styling */
.section-header {
  background-color: rgba(var(--v-theme-primary), 0.1);
  font-weight: bold;
}

.section-header td {
  padding: 12px 16px;
  font-size: 1.1em;
  text-align: center !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.rocket-comparison-container tr:not(.section-header):hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.rocket-comparison-container tr:nth-child(even):not(.section-header) {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Cell styling and alignment */
.rocket-comparison-container th,
.rocket-comparison-container td {
  padding: 12px 16px;
  vertical-align: middle;
}

.rocket-comparison-container .feature-name {
  text-align: center !important;
}

.rocket-comparison-container .feature-name .d-flex {
  justify-content: center !important;
  margin: 0 auto;
}
</style>

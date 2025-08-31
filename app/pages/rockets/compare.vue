<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Page Header Component -->
        <PageHeader
          title="Rocket Comparison"
          subtitle="Compare SpaceX rockets side by side to understand their specifications and capabilities"
          icon="mdi-rocket-launch"
        >
          <template #actions>
            <div class="header-actions">
              <v-btn
                to="/rockets"
                variant="outlined"
                prepend-icon="mdi-rocket"
                color="primary"
                class="action-btn"
              >
                <span class="d-none d-sm-inline">Browse</span> Rockets
              </v-btn>
              <v-btn
                @click="clearSelection"
                variant="outlined"
                prepend-icon="mdi-refresh"
                color="error"
                :disabled="!selectedRockets.length"
                class="action-btn"
              >
                Clear <span class="d-none d-sm-inline">Selection</span>
              </v-btn>
            </div>
          </template>
        </PageHeader>

        <!-- Rocket Selection -->
        <v-card class="mb-6" variant="outlined">
          <v-card-title>
            <v-icon icon="mdi-rocket-launch" class="mr-2" />
            Select Rockets to Compare
          </v-card-title>
          <v-card-text>
            <p class="mb-4 text-medium-emphasis">
              Select up to {{ maxRocketCompare }} rockets to compare their technical specifications side by side.
            </p>

            <v-row class="mt-4">
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedRocket1"
                  :items="availableRockets"
                  item-title="name"
                  item-value="id"
                  label="First Rocket"
                  variant="outlined"
                  prepend-inner-icon="mdi-rocket"
                  :return-object="true"
                  clearable
                  @update:modelValue="updateUrl"
                >
                  <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar color="primary" class="mr-2">
                          <v-icon icon="mdi-rocket" size="small" />
                        </v-avatar>
                      </template>
                      <v-list-item-subtitle>
                        <v-chip
                          :color="item.raw.active ? 'success' : 'error'"
                          size="x-small"
                          variant="outlined"
                          class="mt-1"
                        >
                          {{ item.raw.active ? 'Active' : 'Inactive' }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedRocket2"
                  :items="availableRocketsForSecond"
                  item-title="name"
                  item-value="id"
                  label="Second Rocket"
                  variant="outlined"
                  prepend-inner-icon="mdi-rocket"
                  :return-object="true"
                  clearable
                  @update:modelValue="updateUrl"
                >
                  <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar color="primary" class="mr-2">
                          <v-icon icon="mdi-rocket" size="small" />
                        </v-avatar>
                      </template>
                      <v-list-item-subtitle>
                        <v-chip
                          :color="item.raw.active ? 'success' : 'error'"
                          size="x-small"
                          variant="outlined"
                          class="mt-1"
                        >
                          {{ item.raw.active ? 'Active' : 'Inactive' }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Loading state -->
        <LoadingState
          v-if="pending"
          message="Loading rocket data..."
        />

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

        <!-- Comparison Table -->
        <RocketComparisonTable 
          :rockets="selectedRockets"
          v-else
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { Rocket } from '~/composables/types'

// Define page metadata
definePageMeta({
  title: 'Rocket Comparison',
  description: 'Compare SpaceX rockets side by side to understand their specifications and capabilities'
})

// Maximum number of rockets to compare
const maxRocketCompare = 2

// GraphQL query to fetch complete rocket data for comparison
const query = gql`
  query getRockets {
    rockets {
      id
      name
      active
      boosters
      company
      cost_per_launch
      country
      description
      diameter {
        feet
        meters
      }
      engines {
        engine_loss_max
        layout
        number
        propellant_1
        propellant_2
        thrust_sea_level {
          kN
          lbf
        }
        thrust_to_weight
        thrust_vacuum {
          kN
          lbf
        }
        type
        version
      }
      first_flight
      height {
        feet
        meters
      }
      landing_legs {
        material
        number
      }
      mass {
        kg
        lb
      }
      payload_weights {
        id
        kg
        lb
        name
      }
      second_stage {
        burn_time_sec
        engines
        fuel_amount_tons
        payloads {
          composite_fairing {
            diameter {
              feet
              meters
            }
          }
        }
        thrust {
          kN
          lbf
        }
      }
      stages
      success_rate_pct
      type
      wikipedia
    }
  }
`

// Execute the query
const { data, pending, error, refresh } = useAsyncQuery<{
  rockets: Rocket[]
}>(query)

// Computed property to get rockets array
const allRockets = computed(() => (data.value?.rockets ?? []) as Rocket[])

// Set up selection
const selectedRocket1 = ref<Rocket | null>(null)
const selectedRocket2 = ref<Rocket | null>(null)

// Route and router for query params
const route = useRoute()
const router = useRouter()

// Computed properties for selections
const availableRockets = computed(() => {
  return allRockets.value
})

const availableRocketsForSecond = computed(() => {
  if (!selectedRocket1.value) return allRockets.value
  return allRockets.value.filter(r => r.id !== selectedRocket1.value?.id)
})

const selectedRockets = computed(() => {
  const rockets: Rocket[] = []
  if (selectedRocket1.value) rockets.push(selectedRocket1.value)
  if (selectedRocket2.value) rockets.push(selectedRocket2.value)
  return rockets
})

// Handle URL updates
const updateUrl = () => {
  const query: { rocket1?: string; rocket2?: string } = {}
  
  if (selectedRocket1.value) {
    query.rocket1 = selectedRocket1.value.id
  }
  
  if (selectedRocket2.value) {
    query.rocket2 = selectedRocket2.value.id
  }
  
  router.replace({ 
    query: Object.keys(query).length ? query : undefined 
  })
}

// Initialize from URL params
watch(allRockets, (newRockets) => {
  if (!newRockets.length) return
  
  const rocket1Id = route.query.rocket1 as string
  const rocket2Id = route.query.rocket2 as string
  
  if (rocket1Id) {
    const rocket1 = newRockets.find(r => r.id === rocket1Id)
    if (rocket1) selectedRocket1.value = rocket1
  }
  
  if (rocket2Id) {
    const rocket2 = newRockets.find(r => r.id === rocket2Id)
    if (rocket2) selectedRocket2.value = rocket2
  }
}, { immediate: true })

// Clear selection
const clearSelection = () => {
  selectedRocket1.value = null
  selectedRocket2.value = null
  updateUrl()
}

// SEO optimization
useHead({
  title: 'SpaceX Rocket Comparison',
  meta: [
    {
      name: 'description',
      content: 'Compare SpaceX rockets side by side to understand their specifications, performance data, and technical capabilities.'
    },
    {
      property: 'og:title',
      content: 'SpaceX Rocket Comparison Tool'
    },
    {
      property: 'og:description',
      content: 'Compare multiple SpaceX rockets side by side to understand their technical specifications and performance capabilities.'
    }
  ]
})
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
}

.action-btn {
  margin-bottom: 8px;
  min-width: auto;
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header-actions {
    justify-content: center;
    gap: 12px;
  }
  
  .action-btn {
    flex-grow: 1;
    width: calc(50% - 6px);
    max-width: 180px;
    font-size: 0.875rem;
    padding: 0 12px;
  }
  
  .v-btn__prepend {
    margin-right: 4px;
  }
  
  /* Apply to all buttons in page header for consistency */
  :deep(.page-header .v-btn) {
    margin: 4px;
  }
}
</style>

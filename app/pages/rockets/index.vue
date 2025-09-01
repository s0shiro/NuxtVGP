<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Page Header Component -->
        <PageHeader
          title="SpaceX Rockets"
          subtitle="Browse all SpaceX rockets with detailed specifications and information"
          icon="mdi-rocket"
        >
          <template #actions>
            <v-btn
              to="/launches"
              variant="outlined"
              prepend-icon="mdi-rocket-launch"
              color="primary"
              class="mr-2"
            >
              View Launches
            </v-btn>
            <v-btn
              to="/rockets/compare"
              variant="outlined"
              prepend-icon="mdi-compare"
              color="secondary"
            >
              Compare Rockets
            </v-btn>
          </template>
        </PageHeader>

        <!-- Loading state using component -->
        <LoadingState 
          v-if="pending" 
          message="Loading rockets..."
        />

        <!-- Debug info (remove this after testing) -->
        <v-alert 
          v-if="false"
          type="info" 
          class="mb-4"
        >
          Debug: pending = {{ pending }}, hasData = {{ !!rockets.length }}
        </v-alert>

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
                <AppCard
                  :title="rocket.name"
                  icon="mdi-rocket"
                  :elevation="3"
                  hover
                  card-class="rocket-card"
                >
                  <!-- Rocket Information Grid -->
                  <div class="rocket-info-grid">
                    <!-- Status Card -->
                    <v-card 
                      variant="tonal" 
                      :color="rocket.active ? 'success' : 'error'" 
                      class="info-card"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon 
                            :icon="rocket.active ? 'mdi-check-circle' : 'mdi-close-circle'"
                            :color="rocket.active ? 'success' : 'error'" 
                            class="mr-2" 
                          />
                          <span 
                            class="text-subtitle-2 font-weight-bold"
                            :class="rocket.active ? 'text-success' : 'text-error'"
                          >
                            Status
                          </span>
                        </div>
                        <p class="text-body-2 mb-1 font-weight-medium">
                          {{ rocket.active ? 'Active' : 'Inactive' }}
                        </p>
                      </v-card-text>
                    </v-card>

                    <!-- Description Card -->
                    <v-card 
                      variant="tonal" 
                      color="primary" 
                      class="info-card description-card"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon icon="mdi-text" color="primary" class="mr-2" />
                          <span class="text-subtitle-2 font-weight-bold text-primary">Description</span>
                        </div>
                        <div class="description-content">
                          <p class="text-body-2 text-high-emphasis">
                            {{ truncateText(rocket.description, 150) || 'No description available' }}
                          </p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>

                  <!-- Action Buttons -->
                  <template #actions>
                    <v-btn
                      :to="`/rockets/${rocket.id}`"
                      variant="outlined"
                      color="primary"
                      prepend-icon="mdi-information"
                      class="mr-2"
                    >
                      View Details
                    </v-btn>
                    <v-btn
                      :to="`/rockets/compare?rocket1=${rocket.id}`"
                      variant="text"
                      color="secondary"
                      prepend-icon="mdi-compare"
                    >
                      Compare
                    </v-btn>
                  </template>
                </AppCard>
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
  active: boolean
}

// GraphQL query to fetch rockets
const query = gql`
  query getRockets {
    rockets {
      id
      name
      description
      active
    }
  }
`

// Execute the query
const { data, pending, error } = await useAsyncQuery<{
  rockets: RocketSummary[]
}>(query)

// Computed property to get rockets array
const rockets = computed(() => (data.value?.rockets ?? []) as RocketSummary[])

// Utility functions
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
/* CSS Custom Properties for consistent theming */
.rocket-page {
  --card-radius: 8px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-card: 0 12px 40px rgba(0, 0, 0, 0.15);
  --transition-fast: 0.2s ease-in-out;
  --transition-normal: 0.3s ease-out;
  --transition-slow: 0.5s ease;
}

/* Rocket Cards */
.rocket-card {
  height: 100%;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card) !important;
}

/* Rocket Information Grid */
.rocket-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .rocket-info-grid {
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
.description-card {
  grid-column: 1 / -1;
}

/* Description Content */
.description-content {
  max-height: 120px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom Scrollbar */
.description-content::-webkit-scrollbar {
  width: 4px;
}

.description-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.description-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.description-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
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
@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.rocket-card .v-chip { animation: fadeInScale var(--transition-normal); }

/* Responsive Behavior */
@media (max-width: 767px) {
  .rocket-info-grid {
    grid-template-columns: 1fr;
  }

  .description-card {
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
</style>

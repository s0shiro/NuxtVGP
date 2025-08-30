<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-h3 mb-4">
            <v-icon icon="mdi-heart" class="mr-3" color="red" />
            Favorite Rockets
          </h1>
          
          <!-- Stats and Actions -->
          <div class="d-flex flex-wrap align-center justify-space-between mb-4">
            <v-chip
              color="primary"
              variant="elevated"
              prepend-icon="mdi-counter"
            >
              {{ favoritesStore.favoriteCount }} favorite{{ favoritesStore.favoriteCount !== 1 ? 's' : '' }}
            </v-chip>
            
            <v-btn
              v-if="favoritesStore.hasFavorites"
              color="red"
              variant="outlined"
              prepend-icon="mdi-trash-can"
              @click="showClearDialog = true"
            >
              Clear All Favorites
            </v-btn>
          </div>
        </div>

        <!-- No Favorites State -->
        <div v-if="!favoritesStore.hasFavorites" class="text-center py-12">
          <v-icon icon="mdi-heart-broken-outline" size="120" color="grey" class="mb-6" />
          <h2 class="text-h4 mb-4 text-medium-emphasis">No Favorite Rockets Yet</h2>
          <p class="text-body-1 mb-6 text-medium-emphasis">
            Start exploring rockets and add them to your favorites by clicking the heart icon.
          </p>
          <div class="d-flex flex-column sm:flex-row ga-3 justify-center">
            <v-btn
              to="/rockets"
              variant="elevated"
              color="primary"
              size="large"
              prepend-icon="mdi-rocket"
            >
              Browse Rockets
            </v-btn>
            <v-btn
              to="/launches"
              variant="outlined"
              color="primary"
              size="large"
              prepend-icon="mdi-rocket-launch"
            >
              View Launches
            </v-btn>
          </div>
        </div>

        <!-- Favorites Grid -->
        <div v-else>
          <transition-group name="favorites-grid" tag="div" class="v-row">
            <v-col
              v-for="rocket in favoritesStore.favorites"
              :key="rocket.id"
              cols="12"
              md="6"
              lg="4"
              class="favorite-item"
            >
              <v-card
                class="favorite-card mb-4"
                elevation="2"
                hover
              >
                <!-- Card Header with Remove Button -->
                <v-card-title class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-rocket" class="mr-2" />
                    <span class="text-truncate">{{ rocket.name }}</span>
                  </div>
                  <v-btn
                    icon
                    variant="text"
                    color="red"
                    @click="favoritesStore.removeFromFavorites(rocket.id)"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </v-card-title>
                
                <v-card-text>
                  <!-- Status Badge -->
                  <v-chip
                    :color="rocket.active ? 'success' : 'error'"
                    variant="elevated"
                    prepend-icon="mdi-circle"
                    size="small"
                    class="mb-3"
                  >
                    {{ rocket.active ? 'Active' : 'Inactive' }}
                  </v-chip>

                  <!-- Description -->
                  <div class="mb-4">
                    <h4 class="text-subtitle-1 mb-2">Description</h4>
                    <p class="text-body-2 text-medium-emphasis">
                      {{ rocket.description || 'No description available' }}
                    </p>
                  </div>

                  <!-- Key Stats -->
                  <div class="rocket-stats">
                    <div v-if="rocket.first_flight" class="stat-item mb-2">
                      <v-icon icon="mdi-calendar-star" size="small" class="mr-2" color="orange" />
                      <span class="text-body-2">
                        <strong>First Flight:</strong> {{ formatDate(rocket.first_flight) }}
                      </span>
                    </div>
                    
                    <div v-if="rocket.height" class="stat-item mb-2">
                      <v-icon icon="mdi-arrow-up-down" size="small" class="mr-2" color="blue" />
                      <span class="text-body-2">
                        <strong>Height:</strong> {{ rocket.height.meters }}m ({{ rocket.height.feet }}ft)
                      </span>
                    </div>
                    
                    <div v-if="rocket.success_rate_pct !== null" class="stat-item mb-2">
                      <v-icon icon="mdi-target" size="small" class="mr-2" color="success" />
                      <span class="text-body-2">
                        <strong>Success Rate:</strong> {{ rocket.success_rate_pct }}%
                      </span>
                    </div>

                    <div v-if="rocket.cost_per_launch" class="stat-item mb-2">
                      <v-icon icon="mdi-currency-usd" size="small" class="mr-2" color="purple" />
                      <span class="text-body-2">
                        <strong>Cost per Launch:</strong> {{ formatCurrency(rocket.cost_per_launch) }}
                      </span>
                    </div>
                  </div>
                </v-card-text>

                <!-- Card Actions -->
                <v-card-actions>
                  <v-btn
                    :to="`/rockets/${rocket.id}`"
                    variant="elevated"
                    color="primary"
                    prepend-icon="mdi-information"
                    block
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </transition-group>
        </div>
      </v-col>
    </v-row>

    <!-- Clear All Confirmation Dialog -->
    <v-dialog
      v-model="showClearDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-alert-circle" color="warning" class="mr-2" />
          Clear All Favorites?
        </v-card-title>
        
        <v-card-text>
          <p class="text-body-1">
            Are you sure you want to remove all {{ favoritesStore.favoriteCount }} rocket{{ favoritesStore.favoriteCount !== 1 ? 's' : '' }} from your favorites?
          </p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            This action cannot be undone.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showClearDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            variant="elevated"
            @click="confirmClearAll"
          >
            Clear All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
// Define page metadata
definePageMeta({
  title: 'Favorite Rockets',
  description: 'Your collection of favorite SpaceX rockets'
})

// Initialize favorites store
const favoritesStore = useFavorites()

// Local state for dialog
const showClearDialog = ref(false)

// Actions
const confirmClearAll = () => {
  favoritesStore.clearAllFavorites()
  showClearDialog.value = false
}

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
  title: 'Favorite Rockets',
  meta: [
    {
      name: 'description',
      content: 'Your personal collection of favorite SpaceX rockets with detailed information and specifications.'
    },
    {
      property: 'og:title',
      content: 'Favorite Rockets - SpaceX Collection'
    },
    {
      property: 'og:description',
      content: 'Manage and view your favorite SpaceX rockets in one convenient location.'
    }
  ]
})
</script>

<style scoped>
.favorite-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
}

.rocket-stats {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.2);
  padding-left: 12px;
}

/* Transition animations for favorites */
.favorites-grid-move,
.favorites-grid-enter-active,
.favorites-grid-leave-active {
  transition: all 0.3s ease;
}

.favorites-grid-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.favorites-grid-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.favorites-grid-leave-active {
  position: absolute;
  width: 100%;
}

.favorite-item {
  position: relative;
}

/* Responsive flex for buttons */
.sm\:flex-row {
  flex-direction: column;
}

@media (min-width: 600px) {
  .sm\:flex-row {
    flex-direction: row;
  }
}
</style>

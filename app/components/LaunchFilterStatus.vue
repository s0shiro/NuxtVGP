<template>
  <v-card v-if="hasActiveFilter" class="filter-status-card" elevation="1" color="orange-lighten-5">
    <v-card-text class="py-2">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="mdi-filter" color="orange" class="mr-2" />
          <span class="text-body-2">
            Filtering by <strong>{{ selectedYear }}</strong>
          </span>
        </div>
        <v-btn
          size="small"
          variant="text"
          color="orange"
          @click="clearFilters"
        >
          <v-icon icon="mdi-close" />
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
// Access the Pinia store
const filterStore = useLaunchFilters()

// Computed properties from store
const hasActiveFilter = computed(() => filterStore.hasActiveFilter)
const selectedYear = computed(() => filterStore.selectedYear)

// Methods
const clearFilters = () => {
  filterStore.clearFilters()
}
</script>

<style scoped>
.filter-status-card {
  border-left: 4px solid rgb(var(--v-theme-orange));
}
</style>

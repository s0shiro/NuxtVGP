<template>
  <v-footer class="bg-grey-lighten-1 text-center d-flex flex-column">
    <!-- Footer Content -->
    <div class="d-flex flex-wrap justify-center align-center px-4 py-3">
      <div class="text-center">
        <p class="mb-1">
          <v-icon icon="mdi-rocket-launch" class="mr-1" />
          <strong>SpaceX Explorer</strong>
        </p>
        <p class="text-caption mb-1">
          Powered by SpaceX GraphQL API
        </p>
        <p class="text-caption">
          Built with 
          <v-icon icon="mdi-vuetify" size="small" class="mx-1" />
          Nuxt 3 & Vuetify
        </p>
      </div>
    </div>
    
    <v-divider class="my-2" />
    
    <!-- Copyright -->
    <div class="px-4 py-2">
      <p class="text-caption text-grey-darken-1 mb-0">
        © {{ currentYear }} SpaceX Explorer. Data provided by SpaceX API.
      </p>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
// Get current year for footer copyright
const currentYear = new Date().getFullYear()
</script>

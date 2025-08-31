<template>
  <div class="app-navigation">
    <!-- Desktop Navigation -->
    <div class="d-none d-md-flex">
      <v-btn
        v-for="link in navigationLinks"
        :key="link.to"
        variant="text"
        :to="link.to"
        :exact="link.exact"
        class="text-white mx-1"
      >
        <v-icon :icon="link.icon" class="mr-1" />
        {{ link.label }}
        <!-- Favorites Badge -->
        <v-badge
          v-if="link.to === '/favorites' && favoritesStore.hasFavorites"
          :content="favoritesStore.favoriteCount"
          color="red"
          class="ml-1"
        />
      </v-btn>
      
      <!-- Theme Toggle Icon (Desktop) -->
      <v-btn
        variant="text"
        class="text-white ml-2 mr-3 theme-toggle-btn"
        size="small"
        @click="toggleTheme"
        :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent'"
        :title="themeTooltip"
      ></v-btn>
    </div>

    <!-- Mobile Navigation Menu -->
    <div class="d-flex d-md-none align-center">
      <!-- Theme Toggle Icon (Mobile) -->
      <v-btn
        variant="text"
        class="text-white mr-2 theme-toggle-btn"
        @click="toggleTheme"
        :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent'"
        density="comfortable"
      ></v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-white"
            icon="mdi-menu"
            density="comfortable"
          />
        </template>
        <v-list>
          <v-list-item
            v-for="link in navigationLinks"
            :key="link.to"
            :to="link.to"
            :exact="link.exact"
          >
            <template v-slot:prepend>
              <v-icon :icon="link.icon" />
            </template>
            <v-list-item-title class="d-flex align-center">
              {{ link.label }}
              <!-- Favorites Badge for Mobile -->
              <v-badge
                v-if="link.to === '/favorites' && favoritesStore.hasFavorites"
                :content="favoritesStore.favoriteCount"
                color="red"
                class="ml-2"
              />
            </v-list-item-title>
          </v-list-item>
          
          <!-- Theme Toggle in Mobile Menu -->
          <v-list-item @click="toggleTheme">
            <template v-slot:prepend>
              <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent'" size="small" />
            </template>
            <v-list-item-title>
              {{ isDark ? 'Light Mode' : 'Dark Mode' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface NavigationLink {
  to: string
  label: string
  icon: string
  exact?: boolean
}

// Initialize stores
const favoritesStore = useFavorites()
const themeStore = useThemeStore()

// Compute theme-related properties - with safe client-side check
const isDark = computed(() => {
  // Only access the store on client-side to prevent SSR issues
  if (import.meta.client) {
    return themeStore.isDark
  }
  return false // Default to light theme on server
})

// Safe toggle theme function
const toggleTheme = () => {
  if (import.meta.client) {
    themeStore.toggleTheme()
  }
}

// Theme tooltip
const themeTooltip = computed(() => isDark.value ? 'Switch to Light Mode' : 'Switch to Dark Mode')

const navigationLinks: NavigationLink[] = [
  {
    to: '/',
    label: 'Home',
    icon: 'mdi-home',
    exact: true
  },
  {
    to: '/launches',
    label: 'Launches',
    icon: 'mdi-rocket'
  },
  {
    to: '/rockets',
    label: 'Rockets',
    icon: 'mdi-rocket-launch-outline'
  },
  {
    to: '/favorites',
    label: 'Favorites',
    icon: 'mdi-heart'
  }
]
</script>

<style scoped>
.app-navigation {
  display: flex;
  align-items: center;
}

/* Icon styling */
:deep(.v-btn--icon) {
  transition: transform 0.3s ease;
}

:deep(.v-btn--icon:hover) {
  transform: scale(1.1);
}

/* Reduce theme toggle icon size */
:deep(.theme-toggle-btn) {
  height: 36px;
  width: 36px;
  min-width: 36px;
  margin-top: 0;
  margin-bottom: 0;
}

:deep(.theme-toggle-btn .v-icon) {
  font-size: 20px;
}

/* Mobile menu icon alignment */
.d-md-none .v-btn {
  height: 36px;
  width: 36px;
}
</style>

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
      </v-btn>
    </div>

    <!-- Mobile Navigation Menu -->
    <div class="d-flex d-md-none">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-white"
            icon="mdi-menu"
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
            <v-list-item-title>{{ link.label }}</v-list-item-title>
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
  }
]
</script>

<style scoped>
.app-navigation {
  display: flex;
  align-items: center;
}
</style>

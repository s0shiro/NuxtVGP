<template>
  <v-card
    :class="cardClasses"
    :elevation="elevation"
    :hover="hover"
    :to="to"
    v-bind="$attrs"
  >
    <!-- Header slot -->
    <div v-if="$slots.header">
      <slot name="header" />
    </div>

    <!-- Title -->
    <v-card-title v-if="title" class="text-wrap">
      <div class="d-flex align-center justify-space-between">
        <span class="d-flex align-center">
          <v-icon v-if="icon" :icon="icon" class="mr-2" />
          {{ title }}
        </span>
        <div v-if="$slots.badge">
          <slot name="badge" />
        </div>
      </div>
    </v-card-title>
    
    <!-- Subtitle -->
    <v-card-subtitle v-if="subtitle">
      {{ subtitle }}
    </v-card-subtitle>

    <!-- Image -->
    <v-img 
      v-if="image" 
      :src="image" 
      :alt="imageAlt || title"
      :height="imageHeight"
      cover
    />

    <!-- Main content -->
    <v-card-text v-if="$slots.default">
      <slot />
    </v-card-text>

    <!-- Actions -->
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  subtitle?: string
  icon?: string
  image?: string
  imageAlt?: string
  imageHeight?: number | string
  elevation?: number | string
  hover?: boolean
  to?: string
  cardClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  elevation: 2,
  hover: false,
  imageHeight: 200
})

const cardClasses = computed(() => {
  const classes = ['app-card']
  if (props.cardClass) {
    classes.push(props.cardClass)
  }
  if (props.hover) {
    classes.push('app-card--hover')
  }
  return classes
})
</script>

<style scoped>
.app-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.app-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.app-card .v-card-title {
  word-break: break-word;
}
</style>

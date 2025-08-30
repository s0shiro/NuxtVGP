<template>
  <div class="loading-state text-center py-12">
    <v-progress-circular
      :size="size"
      :width="width"
      :color="color"
      indeterminate
    />
    <p :class="textClass">{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  message?: string
  size?: number
  width?: number
  color?: string
  textClass?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  size: 70,
  width: 7,
  color: 'primary',
  textClass: 'mt-4 text-h6'
})
</script>

<style scoped>
.loading-state {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

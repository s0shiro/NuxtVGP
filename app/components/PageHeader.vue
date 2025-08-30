<template>
  <div class="page-header mb-6">
    <div class="d-flex align-center justify-space-between flex-wrap">
      <div class="header-content">
        <h1 :class="titleClass">
          <v-icon v-if="icon" :icon="icon" class="mr-3" />
          {{ title }}
        </h1>
        <p v-if="subtitle" :class="subtitleClass">
          {{ subtitle }}
        </p>
      </div>
      
      <div v-if="$slots.actions" class="header-actions mt-3 mt-md-0">
        <slot name="actions" />
      </div>
    </div>
    
    <div v-if="$slots.content" class="header-extended-content mt-4">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string
  subtitle?: string
  icon?: string
  titleClass?: string
  subtitleClass?: string
}

withDefaults(defineProps<Props>(), {
  titleClass: 'text-h3',
  subtitleClass: 'text-h6 text-grey-darken-1'
})
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 16px;
}

.header-content {
  flex: 1;
}

.header-actions {
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .page-header {
    text-align: center;
  }
  
  .d-flex.align-center.justify-space-between {
    flex-direction: column;
    align-items: center !important;
  }
}
</style>

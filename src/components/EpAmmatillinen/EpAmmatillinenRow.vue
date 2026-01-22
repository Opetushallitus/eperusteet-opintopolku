<template>
  <div class="flex ammatillinen-row tile-background-shadow-selected shadow-tile">
    <router-link
      v-if="route"
      class="block w-full"
      :to="route"
    >
      <div class="ammatillinen-data">
        <slot />
      </div>
    </router-link>
    <div
      v-else
      class="w-full ammatillinen-data"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

  .ammatillinen-row {
    margin-bottom: 10px;
    border: 1px solid $grey200;
    border-radius: 2px;

    .ammatillinen-data {
      padding: 8px 10px;
      margin-left: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      color: $black;
    }
  }

</style>

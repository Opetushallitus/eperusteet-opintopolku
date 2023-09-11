<template>
  <div class="d-flex ammatillinen-row tile-background-shadow-selected shadow-tile" >
    <router-link class="w-100" :to="route">
      <div class="ammatillinen-data">
        <slot/>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EpAmmatillinenRow extends Vue {
  @Prop({ required: true })
  private route: any;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

  .ammatillinen-row {
    margin-bottom: 10px;
    border: 1px solid $gray-lighten-9;
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

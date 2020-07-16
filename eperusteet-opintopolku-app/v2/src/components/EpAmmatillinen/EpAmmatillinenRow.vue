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
    border-radius: 0;
    margin: 5px;
    border: 1px solid rgb(232, 232, 233);

    .ammatillinen-data {
      padding: 8px 10px;

      border-left: 3px solid $green;
      margin-left: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      color: $black;
    }
  }

</style>

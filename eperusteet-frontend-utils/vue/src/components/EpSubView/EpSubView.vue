<template>
  <div class="subview">
    <div class="top d-flex align-items-center">
      <slot name="header">
        <h2 class="header">{{ header }}</h2>
      </slot>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpSubview extends Vue {
  @Prop({ required: false })
  private header!: string;
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.subview {
  margin-top: 4px;

  .top {
    border-bottom: 1px solid #eee;
    font-weight: 600;
    padding: 5px 15px 5px 15px;
    height: 50px;

    .header {
      margin-bottom: 0;
    }
  }

  .content {
    margin: 35px 50px 20px 15px;
  }

}

</style>

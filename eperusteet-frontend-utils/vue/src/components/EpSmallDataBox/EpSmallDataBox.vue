<template>
  <div class="box d-inline-flex flex-column align-items-center text-center align-items-end">
    <div class="count">{{count}}</div>
    <div class="topic">{{topic}}</div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';

@Component
export default class EpSmallDataBox extends Vue {
  @Prop({ required: true })
  private topic!: string;

  @Prop({ required: true })
  private count!: number;
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .box {
    width: 125px;
    margin-right: 10px;
    margin-top: 10px;
    padding: 10px;
    background-color: #f7f8fc;

    .count {
      font-size: 2.375rem;
      line-height: 1;

      .secondary {
        font-size: 1rem;
        color: $gray-lighten-1;
      }
    }

    .topic {
      font-size: 0.7rem;
      padding-top: 10px;
    }
  }

</style>

<template>
<div class="spinner" :class="{'small': small}">
  <div class="oph-spinner">
    <div class="oph-bounce oph-bounce1" :style="style"></div>
    <div class="oph-bounce oph-bounce2" :style="style"></div>
    <div class="oph-bounce oph-bounce3" :style="style"></div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpSpinner extends Vue {
  @Prop({ required: false, type: Boolean })
  private small!: boolean;

  @Prop({ required: false })
  private color!: string;

  get style() {
    if (this.color) {
      return { 'background-color': this.color + ' !important' };
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";
@import "./style.scss";

.spinner {
  margin-top: 5px;

  &.small {
    .oph-bounce {
      height: 10px;
      width: 10px;
    }
  }

  .oph-bounce {
    background-color: $spinner-background-color !important;
  }
}
</style>

<template>
  <div class="ep-content-view">
    <div class="header border-bottom-1" v-if="hasHeader">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="default"></slot>
    </div>
    <slot name="after"></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpContentView extends Vue {
  get hasHeader() {
    return !!this.$scopedSlots.header;
  }
}
</script>

<style scoped lang="scss">

@import "../../styles/_variables.scss";

.content {
  padding: $content-padding;
}

.header {
  padding: $content-padding;
}

</style>

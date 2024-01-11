<template>
  <span :class="'material-icons' + shape"
        class="icon"
        :style="{color: color, fontSize: size, background: background}"
        aria-hidden="true">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpMaterialIcon extends Vue {
  @Prop({ required: false, default: '' })
  iconShape?: string;

  @Prop({ required: false })
  color?: string;

  @Prop({ required: false })
  background?: string;

  @Prop({ required: false })
  size?: string;

  get shape() {
    if (this.iconShape === 'outlined' || this.iconShape === 'rounded') {
      return '-' + this.iconShape;
    }
    else {
      // default = filled
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>

.icon {
  display: inline-block !important;
  vertical-align: sub;
}

</style>

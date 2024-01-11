<template>
<span ref="circle"
      :style="circleStyle"
      :title="$t(help)"
      :class="circleClass">
  <b-popover v-if="help"
             :target="() => $refs['circle']"
             :placement="'top'"
             triggers="hover"
             variant="primary">
    <span>{{$t(help)}}</span>
  </b-popover>
</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpColorCircle extends Vue {
  @Prop({ default: '#000000' })
  color!: string;

  @Prop({ required: false })
  help!: string | undefined;

  @Prop({ default: 10 })
  size!: number;

  get circleStyle() {
    return {
      'min-height': this.size + 'px',
      'min-width': this.size + 'px',
      'background': this.color,
    };
  }

  get circleClass() {
    return this.help ? 'circle circle-tooltip' : 'circle';
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.circle {
  background: black;
  border-radius: 100%;
  display: inline-block;
}

.circle-tooltip {
  cursor: help;
}

</style>

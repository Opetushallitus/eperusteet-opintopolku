<template>
  <div class="d-flex align-items-center" v-if="postfixLabel">
    <div
      :id="'item-popover'+node.id"
      class="postfix"
      v-if="node.meta && node.meta.postfix_label">
      ({{$t(postfixLabel)}})
    </div>
    <b-popover
      v-if="node.meta && node.meta.postfix_tooltip"
      :target="'item-popover'+node.id"
      triggers="click hover"
      placement="right">
      {{$t(postfixTooltip)}}
    </b-popover>
  </div>
</template>

<script lang="ts">
import { NavigationNodeDto } from '@shared/tyypit';
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpNavigationPostFix extends Vue {
  @Prop()
  node!: NavigationNodeDto

  get postfixLabel(): string {
    return _.toString(this.node.meta?.postfix_label);
  }

  get postfixTooltip(): string {
    return _.toString(this.node.meta?.postfix_tooltip);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.postfix {
  font-size: 0.9rem;
  font-weight: 600;
}

</style>

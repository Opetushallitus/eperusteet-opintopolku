<template>
  <div>
    <span v-if="numerointi">{{numerointi}} </span>
    {{ $kaannaOlioTaiTeksti(node.label) }}
    <span v-if="koodi" class="code-field">({{ koodi }})</span>
  </div>

</template>

<script lang="ts">
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpSidenavNodeLabel extends Vue {
  @Prop({ required: true })
  node!: NavigationNode;

  get koodi() {
    return _.get(this.node, 'meta.koodi.arvo') || _.get(this.node, 'meta.koodi');
  }

  get numerointi() {
    return _.get(this.node, 'meta.numerointi');
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

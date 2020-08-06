<template>
<div class="node" :class="{ 'node-root': isRoot }">
  <div v-if="!isRoot">
    <div class="indicator-wrapper" v-if="isModuuli">
      <ep-color-indicator :kind="node.meta.pakollinen ? 'pakollinen' : 'valinnainen'" />
    </div>
    <div class="label-wrapper">
      <b-link v-if="node.location && !subtype" :to="node.location">
        <span class="label" :class="{ 'label-match': isMatch }">
          {{ $kaannaOlioTaiTeksti(node.label) }}
        </span>
      </b-link>
      <div v-else
            class="label label-plain"
            :class="{ 'label-match': isMatch, 'subtype': subtype }">
        {{ $kaannaOlioTaiTeksti(node.label) }}
      </div>
    </div>
  </div>
  <!-- children -->
  <ul :class="{ 'root-list': isRoot }" v-if="hasChildren">
    <li v-for="(child, idx) in children" :key="idx">
      <EpSidenavNode :node="child" :current="current" :getChildren="getChildren" />
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';

@Component({
  name: 'EpSidenavNode',
  components: {
    EpColorIndicator,
  },
})
export default class EpSidenavNode extends Vue {
  @Prop({ required: true })
  node!: NavigationNode;

  @Prop({ required: false })
  current!: NavigationNode;

  @Prop({ required: false })
  getChildren!: Function;

  get children() {
    return this.getChildren(this.node);
  }

  get hasChildren() {
    return !_.isEmpty(this.children);
  }

  get isModuuli() {
    return this.node.type === 'moduuli' && typeof _.get(this.node, 'meta.pakollinen') === 'boolean';
  }

  get isRoot() {
    return this.node.type === 'root';
  }

  get isMatch() {
    return this.node.isMatch;
  }

  get subtype() {
    return _.get(this.node.meta, 'navigation-subtype');
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.node {
  color: $sidenav-color;
  hyphens: auto;

  &:not(.node-root) {
    padding-top: $sidenav-padding;
  }

  &.root {
    padding: 0;
  }

  a {
    color: $sidenav-color;
    display: block;
  }

  ul, ol {
    // Remove default list styles
    list-style: none;
    margin: 0;
    padding-left: $sidenav-depth-padding;
    counter-reset: item;
    font-size: 15px;
  }

  ol {
    a:before {
      content: counters(item, ".");
      counter-increment: item;
      padding-right: 1em;
    }
  }

  li {
    display: block;
  }

  // First element shouldn't has top padding
  ul.root-list, ol.root-list {
    font-size: 16px;
    padding-left: 0;
    & > li:first-child > .node {
      padding-top: 0;
    }
  }

  .router-link-active {
    font-weight: 600;
  }

  .router-link-exact-active.router-link-active {
    color: $sidenav-active-color;
  }

  .label-plain {
    cursor: not-allowed;
  }

  .label-match {
    font-weight: bold;
  }

  .indicator-wrapper {
    position: absolute;
  }

  // Lisätään margini indikaattorille, jotta rivitys menee samalle tasolle.
  // Esim.
  // o Tekstien tulkinta ja
  //   kirjoittaminen
  .indicator-wrapper + .label-wrapper {
    margin-left: 20px;
  }

  .subtype {
    padding-left: $sidenav-depth-padding;
    padding-top: 5px;
    color: $sidenav-navigation-subtype-color;
  }

}
</style>

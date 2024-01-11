<template>
<div class="sidenav">
  <div v-if="showNavigation" class="bar d-print-none">
    <slot name="bar" />
    <div v-if="$scopedSlots.bottom" class="bottom" v-sticky sticky-side="bottom" sticky-z-index="500">
      <slot name="bottom" />
    </div>
  </div>
  <Portal v-else to="globalNavigation">
    <slot name="bar" />
  </Portal>
  <div class="view" :id="scrollAnchor">
    <slot name="view" />
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpToggle from '../forms/EpToggle.vue';
import Sticky from 'vue-sticky-directive';
import { BrowserStore } from '../../stores/BrowserStore';
import _ from 'lodash';

@Component({
  components: {
    EpToggle,
  },
  directives: {
    Sticky,
  },
})
export default class EpSidebar extends Vue {
  @Prop({ required: false, default: false, type: Boolean })
  private scrollEnabled!: boolean;

  private browserStore = new BrowserStore();

  get showNavigation() {
    return this.browserStore.navigationVisible.value;
  }

  private settings = {
    autoScroll: true,
    showSubchapter: true,
  };

  get scrollAnchor() {
    return this.scrollEnabled && !_.includes(['peruste', 'perusteTiedot'], this.$route?.name) ? 'scroll-anchor' : 'disabled-scroll-anchor';
  }
}
</script>
<style scoped lang="scss">
@import "../../styles/_variables.scss";
.sidenav {
  @media (min-width: 992px) {
    min-height: 100vh;
  }

  .bar {
    width: 340px;

    .bar-buttons {
      padding: 0 $content-padding;
    }

    .bottom {
      background: #fff;
      padding-top: 6px;
      border-top: 1px solid #eee;
      bottom: 0;
      position: fixed;
      width: $sidebar-width;
    }
  }

  @media (max-width: 767.98px) {
    .btn-group-vertical {
      flex-direction: row;
    }

    .view {
      border-top: 2px solid #eee;
      padding-top: 20px;
      margin-top: 10px;
    }
  }

  @media (min-width: 992px) {
    display: flex;
    .bar {
      &.bar-open {
        min-width: $sidebar-width;
      }
    }
    .view {
      width: calc(100% - 340px);
      border-left: 1px solid #eee;
      @media print {
        border-left: none;
      }
    }
  }
}
</style>

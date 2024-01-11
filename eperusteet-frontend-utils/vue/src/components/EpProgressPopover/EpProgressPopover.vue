<template>
  <div>
    <div class="row justify-content-center" id="tila-popover">
      <div class="col-12 progress-area">
        <ep-progress :slices="processSlices" :height="height" :width="width"/>
      </div>
      <div class="col-12 header">
        <slot name="header" />
      </div>
    </div>

    <b-popover
      container="tila-popover"
      target="tila-popover"
      triggers="focus hover blur"
      size="md"
      placement="bottom"
      :show.sync="tilaPopupVisible"
      ref="progresspopover"
      custom-class="progress-popover"
      v-if="$slots.default"
      >

      <div class="popup-top row flex-column align-items-center" :style="popupStyle">
        <div class="progress-area">
          <ep-progress :slices="processSlices" :height="height" :width="width"
                       :popup-style="{ 'background-color': '' }" />
        </div>
        <div class="header">
          <slot name="header" />
        </div>
      </div>

      <div class="slot-area row justify-content-center">
        <slot />
      </div>

      <div class="popup-hr">
        <hr>
      </div>

      <div class="popup-bottom row flex-column align-items-center">
        <slot name="bottom" />
      </div>
    </b-popover>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import EpProgress from './EpProgress.vue';

@Component({
  components: {
    EpProgress,
  },
})
export default class EpProgressPopover extends Vue {
  @Prop({ required: true })
  private slices!: number[];

  private height: number = 60;
  private width: number = 60;

  @Prop({
    default() {
      return {
        'background-color': '#2146a3',
      };
    },
  })
  private popupStyle!: string;

  private tilaPopupVisible = false;

  get processSlices() {
    if (this.slices) {
      if (this.done) {
        return this.slices;
      }
      if (this.zero) {
        return this.slices;
      }

      return [0.2, 0.5, 1];
    }
  }

  get done() {
    return _.size(_.filter(this.slices, (slice) => slice === 1)) === _.size(this.slices);
  }

  get zero() {
    return _.isEqual(this.slices, [0]);
  }
}
</script>

<style lang="scss" scoped>

@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.progress-area {
  width: 100px;
}

.progress-popover {
  width: 250px;
  @include tile-background-shadow-selected;
  border: 0px;
  border-radius: 1rem;
  transform: translate3d(45px, 55px, 0px) !important;

  /deep/ .arrow {
    display:none;
  }

  /deep/ .popover-body {
    padding: 0;

    .popup-top {
      padding: 15px;
      background: $popup-top-background;
      border-radius: 1rem 1rem 0 0;
      font-size: 1rem;
    }

    .slot-area {
      padding: 15px;
      background-color: $white;
    }

    .popup-hr {
      background-color: $white;
      margin-right: -15px;
      margin-left: -15px;
      display: flow-root;
    }

    .popup-bottom {
      padding: 5px 15px;
      background-color: $white;
      border-radius: 0 0 1rem 1rem;
    }

    hr {
      margin: 0;
    }
  }
}

</style>

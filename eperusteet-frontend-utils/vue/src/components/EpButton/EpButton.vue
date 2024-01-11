<template>
<div class="ep-button d-print-none" ref="button-container">
  <b-button :variant="variant"
          v-bind="$attrs"
          :disabled="disabled || showSpinner"
          @click="$emit('click')"
          :size="size"
          :class="variantClass">
    <EpMaterialIcon v-if="icon" class="float-left mr-1" icon-shape="outlined" :background="inherit" :color="inherit">{{ icon }}</EpMaterialIcon>
    <div class="teksti" :class="{'pl-3 pr-3': paddingx}">
      <slot />
      <ep-spinner-inline v-if="showSpinner" :link="variant === 'link' || isOutline"/>
    </div>
  </b-button>
  <b-tooltip v-if="help" :target="() => $refs['button-container']">{{ $t(help) }}</b-tooltip>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpSpinnerInline from '../EpSpinner/EpSpinnerInline.vue';

@Component({
  components: {
    EpSpinnerInline,
    EpMaterialIcon,
  },
})
export default class EpButton extends Vue {
  @Prop({ default: '' })
  private icon!: string;

  @Prop()
  private buttonClass!: string;

  @Prop({ default: false, type: Boolean })
  private disabled!: boolean;

  @Prop({ default: false, type: Boolean })
  private showSpinner!: boolean;

  @Prop({ default: 'primary', type: String })
  private variant!: string;

  @Prop({ default: 'md', type: String })
  private size!: string;

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop({ default: true, type: Boolean })
  private paddingx!: boolean;

  get isOutline() {
    return _.startsWith(this.variant, 'outline');
  }

  get variantClass() {
    let result = 'btn-' + this.variant;
    if (this.isOutline) {
      result = 'no-outline ' + result;
    }
    if (this.buttonClass) {
      result = this.buttonClass + ' ' + result;
    }
    return result;
  }

  get inherit() {
    return this.variant === 'link' ? 'inherit' : '';
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.ep-button {
  display: inline-block;
  white-space: nowrap;

  button.no-outline {
    border: none;
    color: #2B2B2B;
  }

  ::v-deep button.btn-outline-primary:not(.disabled):hover{
    div.teksti {
      color: $white;
    }
  }

  .icon {
    height: 24px;
    width: 24px;
    border-radius: 100%;
    margin: 0;
    padding: 0;
    color: #fff;
    background-color: #3367E3;
  }

  &.no-padding {
    button {
      padding: 0 !important;

      div {
        padding: 0 !important;
      }
    }
  }
}
</style>

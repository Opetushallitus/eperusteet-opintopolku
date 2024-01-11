<template>
  <button class="round-button"
          :class="'round-button-' + variant"
          v-bind="$attrs"
          :disabled="disabled"
          @click="$emit('click')">
    <EpMaterialIcon>{{ icon }}</EpMaterialIcon>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpSpinnerInline from '@shared/components/EpSpinner/EpSpinnerInline.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

  @Component({
    components: {
      EpSpinnerInline,
      EpMaterialIcon,
    },
  })
export default class EpRoundButton extends Vue {
    @Prop({
      required: true,
      type: String,
    })
    private icon!: string;

    @Prop({
      default: false,
      type: Boolean,
    })
    private disabled!: boolean;

    @Prop({ default: 'primary' })
    private variant!: string;
}
</script>

<style lang="scss" scoped>

  .round-button {
    border-radius: 100%;
    background: #668eea;
    border: none;
    color: #fff;
    display: inline-block;
    min-height: 40px;
    min-width: 40px;
    outline: none;
    font-size: 1.2em;
  }

  .round-button-lightblue {
    background: #3D6EC9;
  }

  .round-button-green {
    background: #D26EAF;
  }

  .round-button-pink {
    background: #62ac32;
  }

</style>

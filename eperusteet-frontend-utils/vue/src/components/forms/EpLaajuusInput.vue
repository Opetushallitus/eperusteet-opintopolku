<template>
  <div v-if="!isEditing">
    <div v-if="model">
      {{ model }}
      <slot>
        {{ $t('osaamispiste') }}
      </slot>
    </div>
    <div v-else>
      -
    </div>
  </div>
  <div v-else class="d-flex flex-column">
    <div class="d-flex align-items-center">
      <div class="flex-grow-1">
        <ep-input type="number" v-model="model" min="0" max="999" :is-editing="isEditing" :validation="validation" />
      </div>
      <div class="ml-2">
        <slot>
        {{ $t('osaamispiste') }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component } from 'vue-property-decorator';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpValidation from '../../mixins/EpValidation';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';

@Component({
  components: {
    EpErrorWrapper,
    EpInput,
  },
})
export default class EpLaajuusInput extends EpValidation {
  @Prop({ required: true })
  private value!: number;

  @Prop({ default: false })
  private isEditing!: boolean;

  private model = 0;

  @Watch('value', { immediate: true })
  onValueUpdate(newValue: number) {
    this.model = newValue;
  }

  @Watch('model', { immediate: true })
  onModelUpdate(newValue: number) {
    this.model = Math.max(Math.min(999, Number(newValue)), 0);
    this.$emit('input', this.model);
  }
}
</script>

<style lang="scss" scoped>
</style>

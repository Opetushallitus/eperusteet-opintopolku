<template>
  <ep-input
    class="form-data"
    :value="value"
    @input="$emit('input', $event)"
    :is-editing="isEditing"
    :is-header="isHeader"
    :type="type"
    :validation="validation"
    :help="help"
    :showValidValidation="showValidValidation"
    :unit="unit">
    <template #suffix><slot /></template>
  </ep-input>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import EpFormContent from './EpFormContent.vue';
import EpInput from './EpInput.vue';
import EpValidation from '../../mixins/EpValidation';

@Component({
  components: {
    EpFormContent,
    EpInput,
  },
})
export default class EpField extends Mixins(EpValidation) {
  @Prop({ required: true })
  private value!: string | object;

  @Prop({ default: false, type: Boolean })
  private isHeader!: boolean;

  @Prop({ default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ default: 'localized', type: String })
  private type!: 'localized' | 'string' | 'number';

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop({ default: true, required: false })
  private showValidValidation!: boolean;

  @Prop({ required: false })
  private unit!: string | object;
}
</script>

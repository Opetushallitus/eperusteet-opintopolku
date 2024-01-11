<template>
  <div class="d-flex">
    <EpLaajuusInput
      v-model="value.laajuus"
      :is-editing="isEditing"
      :validation="validation.laajuus">
      <span></span>
    </EpLaajuusInput>

    <EpMultiSelect
      v-if="isEditing"
      v-model="value.laajuusYksikko"
      :options="laajuusYksikot"
      :close-on-select="true"
      :clear-on-select="false"
      :placeholder="$t('valitse-laajuus-yksikko')"
      :validation="validation.laajuusYksikko">
      <template slot="singleLabel" slot-scope="{ option }">
        {{ $t(option.toLowerCase() + '-lyhenne') }}
      </template>
      <template slot="option" slot-scope="{ option }">
        {{ $t(option.toLowerCase() + '-partitiivi') }}
      </template>
    </EpMultiSelect>
    <div v-if="!isEditing && value.laajuusYksikko && value.laajuus" class="ml-2">
      <span> {{ laajuusYksikkoLyhenne }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import EpValidation from '../../mixins/EpValidation';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpLaajuusInput from '@shared/components/forms/EpLaajuusInput.vue';
import { LaajuusYksikkoEnum } from '@shared/api/amosaa';
import _ from 'lodash';

export interface Laajuus {
  laajuus?: number;
  laajuusYksikko?: LaajuusYksikkoEnum;
}

@Component({
  components: {
    EpErrorWrapper,
    EpMultiSelect,
    EpLaajuusInput,
  },
})
export default class EpLaajuusYksikkoInput extends Mixins(EpValidation) {
  @Prop({ required: true })
  private value!: Laajuus;

  @Prop({ default: false })
  private isEditing!: boolean;

  get model() {
    return this.value;
  }

  set model(value) {
    this.$emit('input', value);
  }

  get laajuusYksikot() {
    return [
      LaajuusYksikkoEnum.OPINTOPISTE,
      LaajuusYksikkoEnum.OPINTOVIIKKO,
      LaajuusYksikkoEnum.TUNTI,
      LaajuusYksikkoEnum.VIIKKO,
      LaajuusYksikkoEnum.OSAAMISPISTE,
      LaajuusYksikkoEnum.VUOSI,
      LaajuusYksikkoEnum.VUOSIVIIKKOTUNTI,
    ];
  }

  get laajuusYksikkoLyhenne() {
    return this.$t(_.lowerCase(this.value.laajuusYksikko) + '-lyhenne');
  }
};
</script>

<style lang="scss" scoped>
</style>

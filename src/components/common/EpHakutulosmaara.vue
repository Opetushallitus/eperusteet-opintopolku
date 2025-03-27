<template>
  <div aria-live="polite" tabindex='-1'>
    <slot>
      <div v-if="kokonaismaara">
        <template v-if="!piilotaNakyvaTulosmaara">
          <span aria-hidden="true" class="font-weight-bold mr-1">{{ kokonaismaara }}</span>
          <span aria-hidden="true">{{ $t('hakutulosta') }}</span>
        </template>
        <span class="sr-only" v-if="naytaRuudunlukijaLkm">{{ kokonaismaara }} {{ $t('hakutulosta') }}</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Debounced } from '@shared/utils/delay';
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class EpHakutulosmaara extends Vue {
  @Prop()
  private kokonaismaara!: number | null;

  @Prop({ default: false, type: Boolean })
  private piilotaNakyvaTulosmaara!: boolean;

  private naytaRuudunlukijaLkm = false;

  @Watch('kokonaismaara', { immediate: true })
  async kokonaismaaraUpdate() {
    this.naytaRuudunlukijaLkm = false;
    await this.naytaRuudunlukijaLkmDebounced();
  }

  @Debounced(500)
  async naytaRuudunlukijaLkmDebounced() {
    this.naytaRuudunlukijaLkm = true;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

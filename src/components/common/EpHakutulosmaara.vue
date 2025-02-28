<template>
  <div aria-live="polite">
    <slot>
      <div v-if="kokonaismaara">
        <template v-if="!piilotaNakyvaTulosmaara">
          <span aria-hidden="true" class="font-weight-bold mr-1">{{ kokonaismaara }}</span>
          <span aria-hidden="true">{{ $t('hakutulosta') }}</span>
        </template>
        <span class="sr-only">{{ kokonaismaara }} {{ $t('hakutulosta') }}</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpHakutulosmaara extends Vue {
  @Prop()
  private kokonaismaara!: number | null;

  @Prop({ default: false, type: Boolean })
  private piilotaNakyvaTulosmaara!: boolean;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

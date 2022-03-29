<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 id="tekstikappale-otsikko" class="otsikko mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  },
})
export default class RouteKotoLaajaAlainenOsaaminen extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Watch('current', { immediate: true })
  async fetchAlikappaleet() {
    if (!this.current) {
      return;
    }

    const isMainHeading = !!this.current && this.current.path.length === 2;
    await this.perusteenOsaStore.fetchPerusteenOsa(isMainHeading);
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>

<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 class="otsikko mb-4">{{ $kaanna(perusteenOsa.otsikko) }}</h2>

      <ep-content-viewer :value="$kaanna(perusteenOsa.kuvaus)" :termit="termit" :kuvat="kuvat" />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
  },
})
export default class RouteYleisettavoitteet extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  get current() {
    return this.perusteDataStore.current || null;
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}

</style>

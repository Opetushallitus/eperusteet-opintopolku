<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko"
      >
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <ep-content-viewer
        class="mt-4"
        :value="$kaanna(perusteenOsa.teksti)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { ViiteLaaja } from '@shared/api/eperusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
  },
})
export default class RouteLaajaalainenOsaaminen extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get perusteenOsaViite() {
    return this.perusteenOsaStore.perusteenOsaViite;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get tekstikappaleenOsa() {
    return this.$route.params.osa;
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

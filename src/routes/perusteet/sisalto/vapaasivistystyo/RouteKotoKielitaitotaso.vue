<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <div class="mb-4">
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
        <hr>
      </div>

      <EpKotoTaitotasot
        :value="perusteenOsa.taitotasot"
        :termit="termit"
        :kuvat="kuvat"
      />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpKotoTaitotasot from '@shared/components/EpKotoTaitotasot/EpKotoTaitotasot.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpKotoTaitotasot,
  },
})
export default class RouteKotoKielitaitotaso extends Vue {
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

  get numerointi() {
    return this.current?.meta?.numerointi;
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

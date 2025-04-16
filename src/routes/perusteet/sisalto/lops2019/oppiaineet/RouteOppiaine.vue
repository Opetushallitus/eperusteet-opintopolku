<template>
  <div class="content">
    <div v-if="oppiaine">
      <h2
        class="otsikko"
      >
        {{ $kaanna(oppiaine.nimi) }}
      </h2>

      <div class="teksti">
        <oppiaine-esitys
          :oppiaine="oppiaine"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <EpOpasKiinnitysLinkki :koodi-uri="oppiaineKoodiUri" />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import OppiaineEsitys from './OppiaineEsitys.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    OppiaineEsitys,
    EpOpasKiinnitysLinkki,
  },
})
export default class RouteOppiaine extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get oppiaine() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.oppiaineId }) as any;
  }

  get oppiaineKoodiUri() {
    return this.oppiaine?.koodi?.uri;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

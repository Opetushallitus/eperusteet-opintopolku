<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 id="tekstikappale-otsikko" class="otsikko mb-4">
        <span v-if="numerointi">{{numerointi}}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <div class="row">
        <div class="col-lg-6 col-md-12 mb-4">
          <h3>{{$t('osaamiskokonaisuuden-nimi')}}</h3>
          <div>{{$kaanna(perusteenOsa.nimi)}}</div>
        </div>
        <div class="col-lg-6 col-md-12 mb-4">
          <h3>{{$t('laajuus')}}</h3>
          <div>{{perusteenOsa.minimilaajuus}}</div>
        </div>
      </div>

      <div class="mb-4">
        <h3>{{$t('kuvaus')}}</h3>
        <ep-content-viewer :value="$kaanna(perusteenOsa.kuvaus)" :termit="termit" :kuvat="kuvat" />

        <hr/>
      </div>

      <div class="mb-4">
        <h3>{{$t('opetuksen-tavoitteet')}}</h3>
        <strong>{{$kaanna(perusteenOsa.opetuksenTavoiteOtsikko)}}</strong>
        <ul>
          <li v-for="(tavoite, index) in perusteenOsa.opetuksenTavoitteet" :key="'tavoite'+index">{{$kaanna(tavoite.nimi)}}</li>
        </ul>
        <hr/>
      </div>

      <div>
        <h3>{{$t('arviointi')}}</h3>
        <strong>{{$t('opetuksen-osaamisen-arvioinnin-kohteet')}}</strong>
        <ul>
          <li v-for="(arviointi, index) in perusteenOsa.arvioinnit" :key="'arviointi'+index">{{$kaanna(arviointi)}}</li>
        </ul>
      </div>

      <EpOpasKiinnitysLinkki :koodiUri="osaamiskokonaisuusKoodiUri"/>

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
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpOpasKiinnitysLinkki,
  },
})
export default class RouteOpintokokonaisuus extends Vue {
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

  get osaamiskokonaisuusKoodiUri() {
    return (this.perusteenOsa as any)?.nimiKoodi.uri;
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

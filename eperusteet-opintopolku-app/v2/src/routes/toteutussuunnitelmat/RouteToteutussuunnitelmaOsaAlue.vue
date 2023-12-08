<template>
  <div class="content">
    <ep-spinner v-if="!osaalue" />
    <div v-else>
      <h2 class="otsikko mb-4">
        <span v-if="perusteOsaAlue">{{ $kaanna(perusteOsaAlue.nimi)}}</span>
        <span v-else>{{ $kaanna(osaalue.nimi)}}</span>
        <span v-if="koodi" class="ml-1">({{koodi}})</span>
      </h2>

      <ep-form-content v-if="tutkinnonOsa" class="mt-4" name="tutkinnon-osa">
        <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: {sisaltoviiteId: tutkinnonOsa.id }}">
          {{ $kaannaOlioTaiTeksti(tutkinnonOsa.nimi) }}
        </router-link>
      </ep-form-content>

      <ep-form-content v-if="osaalue.paikallinenTarkennus" class="col-md-12 mt-4" name="koulutuksen-jarjestajan-tarkennus">
        <ep-content-viewer :value="$kaanna(osaalue.paikallinenTarkennus)" :kuvat="kuvat"/>
      </ep-form-content>

      <ep-form-content class="col-md-12 mt-4" v-for="(vapaa, index) in osaalue.vapaat" :key="'osaaluevapaa'+index">
        <label slot="header">{{$kaanna(vapaa.nimi)}}</label>
        <ep-content-viewer :value="$kaanna(vapaa.teksti)" :kuvat="kuvat"/>
      </ep-form-content>

      <ep-form-content class="mt-4" v-if="osaalue.toteutukset && osaalue.toteutukset.length > 0">
        <h3 slot="header">{{$t('koulutuksen-jarjestajan-toteutus')}}</h3>
        <EpToteutukset :toteutukset="osaalue.toteutukset" :kuvat="kuvat"/>
      </ep-form-content>

      <ep-form-content class="mt-4">
        <h3 slot="header" v-if="perusteOsaAlue" class="mb-4">{{$t('perusteen-sisalto')}}</h3>
        <h3 slot="header" v-else class="mb-4">{{$t('sisalto')}}</h3>

        <h4>{{ osaamistavoitteetNimi }}</h4>

        <Osaamistavoite :value="osaamistavoite"
                        :is-valinnainen="false"
                        :showLaajuus="false"
                        :showKoodiArvo="false">
          <div slot="osaamistavoitteet" />
        </Osaamistavoite>

        <Arviointi2020Taulukko v-if="arviointi" :arviointi="arviointi" class="mt-4">
          <h4 slot="header">{{ $t('arviointi')}} </h4>
        </Arviointi2020Taulukko>

      </ep-form-content>

    </div>

  </div>
</template>

<script lang="ts">
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToteutukset from '@/components/EpToteutussuunnitelma/EpToteutukset.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import Osaamistavoite from '@shared/components/EpOsaamistavoite/Osaamistavoite.vue';
import Arviointi2020Taulukko from '@shared/components/EpTutkinnonosa/Arviointi2020Taulukko.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpContentViewer,
    EpSpinner,
    EpFormContent,
    EpToteutukset,
    Osaamistavoite,
    GeneerinenArviointiTaulukko,
    Arviointi2020Taulukko,
  },
})
export default class RouteToteutussuunnitelmaOsaAlue extends Vue {
  @Prop({ required: true })
  opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get osaalueId() {
    return _.toNumber(this.$route.params.osaalueId);
  }

  get sisaltoviiteId() {
    return _.toNumber(this.$route.params.sisaltoviiteId);
  }

  get osaalue() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.osaalueId });
  }

  get tutkinnonOsa() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.sisaltoviiteId });
  }

  get perusteOsaAlue() {
    return _.chain(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsat)
      .map(tosa => tosa.osaAlueet as any[])
      .flatten()
      .find(perusteenOsaAlue => perusteenOsaAlue.id === this.osaalue.perusteenOsaAlueId)
      .value();
  }

  get koodi() {
    return this.osaalue.perusteenOsaAlueKoodi?.split('_')[1].toUpperCase();
  }

  get kuvat() {
    return [
      ...this.opetussuunnitelmaDataStore.kuvat,
      ...this.opetussuunnitelmaDataStore.perusteKuvat,
    ];
  }

  get osaamistavoitteetNimi() {
    if (!this.perusteOsaAlue) {
      return this.$t('osaamistavoitteet') + ', ' + this.osaalue.laajuus + ' ' + this.$t('osaamispiste-lyhenne');
    }

    const nimi = this.osaalue.tyyppi === 'pakollinen'
      ? this.$t('pakolliset-osaamistavoitteet')
      : this.$t('valinnaiset-osaamistavoitteet');
    if (this.osaamistavoite?.laajuus) {
      const laajuusosa = ', ' + this.osaamistavoite.laajuus + ' ' + this.$t('osaamispiste-lyhenne');
      return nimi + laajuusosa;
    }
    else {
      return nimi;
    }
  }

  get osaamistavoite() {
    if (!this.perusteOsaAlue) {
      return { tavoitteet: this.osaalue.osaamistavoitteet };
    }
    else {
      if (this.perusteOsaAlue) {
        if (this.osaalue.tyyppi === 'pakollinen') {
          return this.perusteOsaAlue.pakollisetOsaamistavoitteet;
        }
        else if (this.osaalue.tyyppi === 'valinnainen') {
          return this.perusteOsaAlue.valinnaisetOsaamistavoitteet;
        }
      }
    }
  }

  get arviointi() {
    return this.perusteOsaAlue?.arviointi || this.osaalue.geneerinenArviointiasteikko;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

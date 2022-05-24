<template>
  <div>
    <h2>{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2>
    <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>

    <ep-spinner v-if="!rakenne" />

    <div v-else>
      <ep-content-viewer :value="$kaanna(rakenne.kuvaus)" :kuvat="kuvat" v-if="naytaPerusteenTeksti"/>
      <ep-peruste-rakenne :rakenneOsat="filteredRakenneOsat">
        <template v-slot:nimi="{ rakenneosa }">

          <div v-if="rakenneosa.tutkinnonosa">
            <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: rakenneosa.tutkinnonosa.id}}">
              <ep-color-indicator :tooltip="false" :id="'tutkinto'+rakenneosa.tutkinnonosa.id" :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'" class="mr-2"/>
              {{$kaanna(rakenneosa.tutkinnonosa.tekstiKappale.nimi)}}
            </router-link>
            <b-popover :target="'tutkinto'+rakenneosa.tutkinnonosa.id" :placement="'bottom'" triggers="hover">
              <span v-if="rakenneosa.pakollinen">{{$t('pakollinen-tutkinnon-osa')}}</span>
              <span v-if="!rakenneosa.pakollinen">{{$t('valinnainen-tutkinnon-osa')}}</span>
            </b-popover>
          </div>
          <span v-else>
            {{$kaanna(rakenneosa.nimi)}}
          </span>

        </template>
      </ep-peruste-rakenne>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Matala, OpetussuunnitelmaKaikkiDto } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPerusteRakenne from '@/components/EpAmmatillinen/EpPerusteRakenne.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import * as _ from 'lodash';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { SuorituspolkuRakenneDto } from '@shared/generated/amosaa';

@Component({
  components: {
    EpContentViewer,
    EpPerusteRakenne,
    EpSpinner,
    EpColorIndicator,
  },
})
export default class EpToteutussuunnitelmaSuorituspolku extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private opetussuunnitelma!: OpetussuunnitelmaKaikkiDto;

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get rakenne(): any {
    const suorituspolku = _.find(this.opetussuunnitelma.suorituspolut, polku => polku.sisaltoviiteId === this.sisaltoviite.id);

    return {
      ...suorituspolku,
      osat: this.lisaaTutkinnonOsat(suorituspolku?.osat || [], this.tutkinnonosaViitteetById),
    };
  }

  private lisaaTutkinnonOsat(osat: any[], tutkinnonosatById) {
    return _.map(osat, osa => {
      return {
        ...osa,
        ...(osa['_tutkinnonOsaViite'] && { tutkinnonosa: tutkinnonosatById[_.toNumber(osa['_tutkinnonOsaViite'])] }),
        osat: this.lisaaTutkinnonOsat(osa.osat, tutkinnonosatById),
      };
    });
  }

  get rakenneTutkinnonOsilla() {
    if (this.rakenne) {
      return this.setTutkinnonOsaViitteet(this.rakenne.osat);
    }
  }

  private setTutkinnonOsaViitteet(osat: any[]) {
    return _.chain(osat)
      .map(osa => {
        return {
          ...osa,
          tutkinnonosaViite: this.tutkinnonosaViitteet[_.get(osa, 'tutkinnonosa._tutkinnonOsa')],
          osat: this.setTutkinnonOsaViitteet(osa.osat),
        };
      })
      .value();
  }

  get filteredRakenneOsat() {
    if (this.rakenne) {
      return this.filterRakenneOsat(this.rakenneTutkinnonOsilla);
    }
  }

  private filterRakenneOsat(osat: any[]) {
    return _.chain(osat)
      .filter(osa => !_.includes(this.piilotetutTunnisteet, osa.tunniste))
      .map(osa => {
        return {
          ...osa,
          osat: this.filterRakenneOsat(osa.osat),
        };
      })
      .value();
  }

  get julkaistuTutkinnonosaViitteet() {
    return _.get(this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ 'tyyppi': 'tutkinnonosat' }), 'lapset');
  }

  get julkaistutTutkinnonOsat() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat');
  }

  get tutkinnonosaViitteet() {
    return _.chain(this.julkaistuTutkinnonosaViitteet)
      .map(tutkinnonosaViite => {
        const tutkinnonosa = _.find(this.julkaistutTutkinnonOsat, tutkinnonosa => tutkinnonosa.tosa.id === tutkinnonosaViite.tosa.id);
        return {
          ...tutkinnonosaViite,
          perusteenTutkinnonosaViite: this.perusteenTutkinnonosaViite(tutkinnonosa.tosa.perusteentutkinnonosa),
          tosa: tutkinnonosa.tosa,
        };
      })
      .sortBy('perusteenTutkinnonosaViite.jarjestys')
      .keyBy('tosa.perusteentutkinnonosa')
      .value();
  }

  get tutkinnonosaViitteetById() {
    return _.keyBy(this.tutkinnonosaViitteet, 'perusteenTutkinnonosaViite.id');
  }

  perusteenTutkinnonosaViite(perusteenTutkinnonosaId) {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ '_tutkinnonOsa': _.toString(perusteenTutkinnonosaId) });
  }

  get piilotetutTunnisteet() {
    return _.chain(this.sisaltoviite.suorituspolku!.rivit)
      .filter('piilotettu')
      .map('rakennemoduuli')
      .value();
  }

  get naytaPerusteenTeksti() {
    return !this.sisaltoviite?.suorituspolku?.piilotaPerusteenTeksti;
  }
}
</script>

<style scoped lang="scss">

</style>

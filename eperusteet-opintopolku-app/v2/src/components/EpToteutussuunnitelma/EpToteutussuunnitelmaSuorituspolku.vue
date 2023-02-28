<template>
  <div>
    <h2>{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2>
    <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>

    <ep-spinner v-if="!rakenne" />

    <div v-else>
      <ep-content-viewer :value="$kaanna(rakenne.kuvaus)" :kuvat="kuvat" v-if="naytaPerusteenTeksti"/>
      <ep-peruste-rakenne :rakenneOsat="filteredRakenneOsat">
        <template v-slot:nimi="{ rakenneosa }">

          <div v-if="rakenneosa.tutkinnonosa && rakenneosa.tutkinnonosa.nimi">
            <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: rakenneosa.tutkinnonosa.id}}">
              <ep-color-indicator :tooltip="false" :id="'tutkinto'+rakenneosa.tutkinnonosa.id" :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'" class="mr-2"/>
              <span>{{$kaanna(rakenneosa.tutkinnonosa.nimi)}}</span>
            </router-link>
            <b-popover :target="'tutkinto'+rakenneosa.tutkinnonosa.id" :placement="'bottom'" triggers="hover">
              <span v-if="rakenneosa.pakollinen">{{$t('pakollinen-tutkinnon-osa')}}</span>
              <span v-if="!rakenneosa.pakollinen">{{$t('valinnainen-tutkinnon-osa')}}</span>
            </b-popover>
          </div>
          <div v-else-if="rakenneosa.tutkinnonosa && rakenneosa.tutkinnonosa.perusteenTutkinnonosa">
            <ep-color-indicator :tooltip="false" :id="'tutkinto'+rakenneosa.tutkinnonosa.perusteenTutkinnonosa.id" :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'" class="mr-2"/>
            <span>{{$kaanna(rakenneosa.tutkinnonosa.perusteenTutkinnonosa.nimi)}}</span>
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
      osat: this.lisaaTutkinnonOsat(suorituspolku?.osat || []),
    };
  }

  private lisaaTutkinnonOsat(osat: any[]) {
    return _.map(osat, osa => {
      const perusteenTutkinnonosaViite = this.perusteidenTutkinnonosienViitteetById[_.toNumber(osa['_tutkinnonOsaViite'])];
      const tutkinnonosa = this.tutkinnonosaViitteetById[_.toNumber(osa['_tutkinnonOsaViite'])];
      return {
        ...osa,
        tutkinnonosa: {
          ...(!!tutkinnonosa && tutkinnonosa),
          ...(!!perusteenTutkinnonosaViite && { perusteenTutkinnonosaViite: perusteenTutkinnonosaViite }),
          ...(!!perusteenTutkinnonosaViite && { perusteenTutkinnonosa: this.perusteidenTutkinnonOsatById[_.toNumber(_.get(perusteenTutkinnonosaViite, '_tutkinnonOsa'))] }),
        },
        osat: this.lisaaTutkinnonOsat(osa.osat),
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
        let paikallisetOsat: any[] = [];
        if (_.size(osa.paikallinenKuvaus?.koodit) > 0) {
          paikallisetOsat = this.paikallisetTutkinnonOsatKoodeistaOsiksi(_.map(osa.paikallinenKuvaus?.koodit, koodi => this.trimkoodiarvo(koodi)));
        }

        return {
          ...osa,
          osat: this.setTutkinnonOsaViitteet([
            ...(osa.osat ? osa.osat : []),
            ...paikallisetOsat,
          ]),
        };
      })
      .value();
  }

  paikallisetTutkinnonOsatKoodeistaOsiksi(koodit): any[] {
    return _.map(koodit, koodi => {
      return {
        tutkinnonosa: _.find(this.tutkinnonosaViitteet, tosaviite => this.trimkoodiarvo(tosaviite?.tosa?.omatutkinnonosa?.koodi) === koodi || this.trimkoodiarvo(tosaviite?.tosa?.koodi) === koodi),
      };
    });
  }

  trimkoodiarvo(koodi) {
    return _.trim(_.split(koodi, '_')[_.size(_.split(koodi, '_')) - 1]);
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
    return _.filter(_.get(this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ 'tyyppi': 'tutkinnonosat' }), 'lapset'), viite => viite.tyyppi === 'tutkinnonosa');
  }

  get julkaistutTutkinnonOsat() {
    return _.filter(this.opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat'), tosa => tosa.tyyppi === 'tutkinnonosa');
  }

  get tutkinnonosaViitteet() {
    return _.chain(this.julkaistuTutkinnonosaViitteet)
      .map(tutkinnonosaViite => {
        const tutkinnonosa = _.find(this.julkaistutTutkinnonOsat, tutkinnonosa => tutkinnonosa.tosa.id === tutkinnonosaViite.tosa.id);
        return {
          ...tutkinnonosaViite,
          perusteenTutkinnonosaViite: this.perusteenTutkinnonosaViite(tutkinnonosa.tosa.perusteentutkinnonosa),
          perusteenTutkinnonosa: this.perusteenTutkinnonosa(tutkinnonosa.tosa.perusteentutkinnonosa),
          tosa: tutkinnonosa.tosa,
        };
      })
      .sortBy('perusteenTutkinnonosaViite.jarjestys')
      .value();
  }

  get tutkinnonosaViitteetById() {
    return _.keyBy(this.tutkinnonosaViitteet, 'perusteenTutkinnonosaViite.id');
  }

  perusteenTutkinnonosaViite(perusteenTutkinnonosaId) {
    return _.find(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, perusteTosaViite => _.get(perusteTosaViite, '_tutkinnonOsa') === _.toString(perusteenTutkinnonosaId));
  }

  perusteenTutkinnonosa(perusteenTutkinnonosaId) {
    return _.find(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsat, perusteTosa => perusteTosa.id === perusteenTutkinnonosaId);
  }

  get perusteidenTutkinnonosienViitteetById() {
    return _.keyBy(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, 'id');
  }

  get perusteidenTutkinnonOsatById() {
    return _.keyBy(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsat, 'id');
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

<template>
  <div class="content">
    <EpSpinner v-if="!oppiaine" />
    <template v-else>
      <h2>{{$kaanna(oppiaine.nimi)}}</h2>

      <template v-if="perusteOppiaine">
        <ep-peruste-content
          :naytaSisaltoTyhjana="false"
          :perusteObject="perusteOppiaine.tehtava"
          :pohjaObject="pohjanOppiaine.tehtava"
          :object="oppiaine.tehtava"
          :kuvat="kuvat"
          :termit="termit"/>

        <template v-if="perusteOppiaineVapaatTekstit">
          <div v-for="(vapaaTeksti, index) in perusteOppiaineVapaatTekstit" :key="'vapaateksti'+index" class="mt-5">
            <h4>{{$kaanna(vapaaTeksti.nimi)}}</h4>
            <ep-content-viewer :value="$kaanna(vapaaTeksti.teksti)" :kuvat="kuvat" :termit="termit"/>

            <EpPaikallinenTarkennus headerh4 v-if="vapaaTeksti.oppiaineVapaaTeksti.paikallinenTarkennus">
              <ep-content-viewer :value="$kaanna(vapaaTeksti.oppiaineVapaaTeksti.paikallinenTarkennus)" :kuvat="kuvat" :termit="termit"/>
            </EpPaikallinenTarkennus>
          </div>
        </template>
      </template>

      <b-tabs class="ml-0 pl-0 mt-4" v-if="!vlkId">
        <b-tab class="mt-4" v-for="(opVlk, index) in oppiaineenVuosiluokkakokonaisuudetSorted" :key="'vlk'+index" :title="$kaanna(opVlk.vuosiluokkakokonaisuus.nimi)">
          <oppiaineen-vuosiluokkakokonaisuus :tietue="opVlk" :kuvat="kuvat" :termit="termit"/>
        </b-tab>
      </b-tabs>

      <oppiaineen-vuosiluokkakokonaisuus v-else :tietue="oppiaineenVuosiluokkakokonaisuus" :kuvat="kuvat" :termit="termit"/>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import OppiaineenVuosiluokkakokonaisuus from './OppiaineenVuosiluokkakokonaisuus.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { UnwrappedOpsOppiaineDtoTyyppiEnum } from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import { oppiaineenVuosiluokkakokonaisuudenRakennin } from './vuosiluokka';

@Component({
  components: {
    EpPerusteContent,
    OppiaineenVuosiluokkakokonaisuus,
    EpContentViewer,
    EpAlert,
  },
} as any)
export default class RouteOpetussuunnitelmaPerusopetusOppiaine extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.kaikkiTermit;
  }

  get vlkId() {
    return this.$route.params.vlkId;
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get oppiaine() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.oppiaineId });
  }

  get pohjanOppiaine() {
    return this.oppiaine.pohjanOppiaine ?? {};
  }

  get perusteOppiaine() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: this.oppiaine.tunniste });
  }

  get oppiaineenVuosiluokkakokonaisuudetSorted() {
    return _.chain(this.oppiaineenVuosiluokkakokonaisuudet)
      .map(ovlk => {
        return {
          ...ovlk,
          oppiaineenPohjanVuosiluokkakokonaisuus: _.find(this.oppiaineenPohjanVuosiluokkakokonaisuudet, opvlk => opvlk._vuosiluokkakokonaisuus === ovlk.vuosiluokkakokonaisuus._tunniste),
        };
      })
      .sortBy(ovlk => this.$kaanna(ovlk.vuosiluokkakokonaisuus.nimi))
      .value();
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    return _.chain(this.oppiaineenVuosiluokkakokonaisuudet)
      .map(ovlk => {
        return {
          ...ovlk,
          oppiaineenPohjanVuosiluokkakokonaisuus: _.find(this.oppiaineenPohjanVuosiluokkakokonaisuudet, opvlk => opvlk._vuosiluokkakokonaisuus === ovlk.vuosiluokkakokonaisuus._tunniste),
        };
      })
      .find(ovlk => _.toNumber(ovlk.vuosiluokkakokonaisuus.id) === _.toNumber(this.vlkId))
      .value();
  }

  get opetussuunnitelmanVuosiluokkakokonaisuudet() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('vuosiluokkakokonaisuudet');
  }

  get perusteenVuosiluokkakokonaisuudet() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.vuosiluokkakokonaisuudet');
  }

  get perusteOppiaineVuosiluokkakokonaisuudet() {
    return _.map(this.perusteOppiaine.vuosiluokkakokonaisuudet, ovlk => {
      return {
        ...ovlk,
        tunniste: _.get(_.find(this.perusteenVuosiluokkakokonaisuudet, pvlk => _.toString(pvlk.id) === _.get(ovlk, '_vuosiluokkaKokonaisuus')), 'tunniste'),
      };
    });
  }

  get perusteOppiaineVapaatTekstit() {
    return _.map(this.perusteOppiaine.vapaatTekstit, povt => {
      return {
        ...povt,
        oppiaineVapaaTeksti: _.find(this.oppiaine.vapaatTekstit, ovt => _.toString(povt.id) === _.toString(ovt.perusteenVapaaTekstiId)) || {},
      };
    });
  }

  get oppiaineenPohjanVuosiluokkakokonaisuudet() {
    return this.oppiaine.pohjanOppiaine?.vuosiluokkakokonaisuudet;
  }

  get laajaalaisetOsaamiset() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset');
  }

  get oppiaineenVuosiluokkakokonaisuudet() {
    const oppiaineenVlk = _.filter(this.oppiaine.vuosiluokkakokonaisuudet, vlk =>
      _.includes(_.map(this.opetussuunnitelmanVuosiluokkakokonaisuudet, 'vuosiluokkakokonaisuus._tunniste'), _.get(vlk, '_vuosiluokkakokonaisuus')));

    return _.map(oppiaineenVlk, (oppiaineenVuosiluokkakokonaisuus) => {
      const opetussuunnitelmanVuosiluokkakokonaisuus = _.get(_.find(this.opetussuunnitelmanVuosiluokkakokonaisuudet, vlk => _.get(vlk.vuosiluokkakokonaisuus, '_tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus')), 'vuosiluokkakokonaisuus');
      const perusteenVuosiluokkakokonaisuus = _.find(this.perusteenVuosiluokkakokonaisuudet, vlk => vlk.tunniste === (opetussuunnitelmanVuosiluokkakokonaisuus as any)._tunniste);

      if (this.oppiaine.tyyppi === _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN)) {
        const perusteenOppiaineenVlk = _.find(this.perusteOppiaineVuosiluokkakokonaisuudet, vlk => vlk.tunniste === (opetussuunnitelmanVuosiluokkakokonaisuus as any)._tunniste);
        const oppiaineenPohjanVuosiluokkakokonaisuus = _.find(this.oppiaineenPohjanVuosiluokkakokonaisuudet, ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(opetussuunnitelmanVuosiluokkakokonaisuus, '_tunniste'));

        return oppiaineenVuosiluokkakokonaisuudenRakennin(
          this.oppiaine,
          this.perusteOppiaine,
          this.laajaalaisetOsaamiset,
          oppiaineenVuosiluokkakokonaisuus,
          opetussuunnitelmanVuosiluokkakokonaisuus,
          perusteenOppiaineenVlk,
          oppiaineenPohjanVuosiluokkakokonaisuus,
          perusteenVuosiluokkakokonaisuus,
        );
      }
      else {
        return {
          vuosiluokkakokonaisuus: opetussuunnitelmanVuosiluokkakokonaisuus,
          oppiaineenVuosiluokkakokonaisuus,
          oppiaine: this.oppiaine,
        };
      }
    });
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

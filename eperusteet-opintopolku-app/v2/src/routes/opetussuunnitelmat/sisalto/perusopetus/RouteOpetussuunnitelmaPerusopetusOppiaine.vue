<template>
  <div class="content">
    <EpSpinner v-if="!oppiaine" />
    <template v-else>
      <h2>{{$kaanna(oppiaine.nimi)}}</h2>

      <template v-if="perusteOppiaine">
        <ep-peruste-content :perusteObject="perusteOppiaine.tehtava" :object="oppiaine.tehtava" :kuvat="kuvat" :termit="termit"/>

        <template v-if="perusteOppiaineVapaatTekstit">
          <div v-for="(vapaaTeksti, index) in perusteOppiaineVapaatTekstit" :key="'vapaateksti'+index" class="mt-5">
            <h4>{{$kaanna(vapaaTeksti.nimi)}}</h4>
            <ep-content-viewer :value="$kaanna(vapaaTeksti.teksti)" :kuvat="kuvat" :termit="termit"/>

            <h4>{{ $t('paikallinen-teksti') }}</h4>
            <div v-if="vapaaTeksti.oppiaineVapaaTeksti.paikallinenTarkennus">
              <ep-content-viewer :value="$kaanna(vapaaTeksti.oppiaineVapaaTeksti.paikallinenTarkennus)" :kuvat="kuvat" :termit="termit"/>
            </div>
            <ep-alert v-else :text="$t('paikallista-sisaltoa-ei-maaritetty')" />
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

  get perusteOppiaine() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: this.oppiaine.tunniste });
  }

  get oppiaineenVuosiluokkakokonaisuudetSorted() {
    return _.sortBy(this.oppiaineenVuosiluokkakokonaisuudet, ovlk => this.$kaanna(ovlk.vuosiluokkakokonaisuus.nimi));
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    return _.head(_.filter(this.oppiaineenVuosiluokkakokonaisuudet, ovlk => _.toNumber(ovlk.vuosiluokkakokonaisuus.id) === _.toNumber(this.vlkId)));
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
      const vuosiluokkakokonaisuus = _.head(_.filter(this.opetussuunnitelmanVuosiluokkakokonaisuudet, vlk => _.get(vlk.vuosiluokkakokonaisuus, '_tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus')));

      if (this.oppiaine.tyyppi === _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN)) {
        const oppiaineenPerusteenVuosiluokkakokonaisuus = _.find(this.perusteOppiaineVuosiluokkakokonaisuudet, pvlk => pvlk.tunniste === _.get(vuosiluokkakokonaisuus.vuosiluokkakokonaisuus, '_tunniste'));
        const oppiaineenPohjanVuosiluokkakokonaisuus = _.find(this.oppiaineenPohjanVuosiluokkakokonaisuudet, ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(vuosiluokkakokonaisuus.vuosiluokkakokonaisuus, '_tunniste'));

        return {
          vuosiluokkakokonaisuus: _.get(vuosiluokkakokonaisuus, 'vuosiluokkakokonaisuus'),
          oppiaineenPerusteenVuosiluokkakokonaisuus,
          oppiaineenVuosiluokkakokonaisuus: {
            ...oppiaineenVuosiluokkakokonaisuus,
            vuosiluokat: _.map(oppiaineenVuosiluokkakokonaisuus.vuosiluokat, vuosiluokka => {
              return {
                ...vuosiluokka,
                tavoitteet: this.setVuosiluokanTavoitteet(
                  this.perusteOppiaine,
                  this.laajaalaisetOsaamiset,
                  vuosiluokka,
                  _.get(vuosiluokkakokonaisuus, 'vuosiluokkakokonaisuus')),
              };
            }),
          },
          oppiaineenPohjanVuosiluokkakokonaisuus,
        };
      }
      else {
        return {
          vuosiluokkakokonaisuus: _.get(vuosiluokkakokonaisuus, 'vuosiluokkakokonaisuus'),
          oppiaineenVuosiluokkakokonaisuus,
          oppiaine: this.oppiaine,
        };
      }
    });
  }

  private setVuosiluokanTavoitteet(perusteenOppiaine: any, laajaalaisetOsaamiset: any, vuosiluokka:any, vuosiluokkakokonaisuus: any) {
    const perusteenVlk = _.find(this.perusteOppiaineVuosiluokkakokonaisuudet, vlk =>
      vlk.tunniste === (vuosiluokkakokonaisuus as any)._tunniste);
    const sisaltoalueetMap = _.keyBy(perusteenVlk.sisaltoalueet, 'id');
    const laajaalaisetOsaamisetMap = _.keyBy(laajaalaisetOsaamiset, 'id');
    const vuosiluokanTavoitteet = _.keyBy(vuosiluokka.tavoitteet, 'tunniste');
    const vuosiluokanSisaltoalueet = _.keyBy(vuosiluokka.sisaltoalueet, 'tunniste');
    const kohdealueetById = _.keyBy(perusteenOppiaine.kohdealueet, 'id');
    let kohdealueGlobalIndex = 0;

    return _.chain(perusteenVlk.tavoitteet)
      .filter(tavoite => _.includes(_.map(vuosiluokka.tavoitteet, 'tunniste'), tavoite.tunniste))
      .map(tavoite => {
        return {
          ...tavoite,
          sisaltoalueet: _.chain(tavoite.sisaltoalueet)
            .map((sisaltoalue: string) => sisaltoalueetMap[sisaltoalue])
            .filter((sisaltoalue:any) => vuosiluokanSisaltoalueet[sisaltoalue.tunniste] && !vuosiluokanSisaltoalueet[sisaltoalue.tunniste].piilotettu)
            .map((sisaltoalue: any) => {
              return {
                ...sisaltoalue,
                vuosiluokanSisaltoalue: _.chain(_.get(vuosiluokanTavoitteet[(tavoite.tunniste as string)], 'sisaltoalueet'))
                  .filter(vlSisaltoalue => vlSisaltoalue.sisaltoalueet.tunniste === sisaltoalue.tunniste)
                  .map(vlSisaltoalue => {
                    return {
                      ...vlSisaltoalue,
                      kaytaOmaaKuvausta: vlSisaltoalue.omaKuvaus !== null,
                    } as any;
                  })
                  .sortBy('id')
                  .head()
                  .value(),
              };
            })
            .sortBy([(sisaltoalue: any) => sisaltoalue.nimi[Kielet.getSisaltoKieli.value]])
            .value(),
          laajaalaisetosaamiset: _.chain(tavoite.laajattavoitteet)
            .map((lao: string) => laajaalaisetOsaamisetMap[lao])
            .sortBy([(lao: any) => {
              return lao.nimi[Kielet.getSisaltoKieli.value];
            }])
            .value(),
          kohdealueet: _.map(tavoite.kohdealueet, kohdealue => {
            return {
              ...kohdealueetById[kohdealue as string],
              index: kohdealueGlobalIndex++,
            };
          }),
          vuosiluokanTavoite: vuosiluokanTavoitteet[(tavoite.tunniste as string)],
          hyvanOsaamisenKuvaus: _.find(tavoite.arvioinninkohteet, kohde => kohde.arvosana === 8),
        };
      })
      .value();
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

<template>
  <div class="content">

    <ep-spinner v-if="!oppiaine" />

    <div v-else>

      <h2>{{$kaanna(oppiaine.nimi)}}</h2>

      <div class="mt-4" v-if="hasContent(oppiaine.tehtava)">
        <h3>{{$kaanna(oppiaine.tehtava.otsikko)}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaine.tehtava.teksti)" :kuvat="kuvat" :termit="termit"/>
      </div>

      <b-tabs class="ml-0 pl-0 mt-4" v-model="tabIndex">
        <b-tab class="mt-4" v-for="(vlk, index) in oppiaine.vuosiluokkakokonaisuudet" :key="'vlk'+index" :title="$kaanna(vlk.nimi)">

          <h2>{{$kaanna(vlk.nimi)}}</h2>

          <div class="mt-4" v-if="hasContent(vlk.tehtava)">
            <h3>{{$kaanna(vlk.tehtava.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.tehtava.teksti)" :kuvat="kuvat" :termit="termit"/>
          </div>

          <div class="mt-4" v-if="hasContent(vlk.tyotavat)">
            <h3>{{$kaanna(vlk.tyotavat.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.tyotavat.teksti)" :kuvat="kuvat" :termit="termit"/>
          </div>

          <div class="mt-4" v-if="hasContent(vlk.ohjaus)">
            <h3>{{$kaanna(vlk.ohjaus.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.ohjaus.teksti)" :kuvat="kuvat" :termit="termit"/>
          </div>

          <div class="mt-4" v-if="hasContent(vlk.arviointi)">
            <h3>{{$kaanna(vlk.arviointi.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.arviointi.teksti)" :kuvat="kuvat" :termit="termit"/>
          </div>

          <div class="mt-4" v-if="vlk.tavoitteet.length > 0">
            <h3>{{$t('oppiaineen-tavoitteet')}}</h3>
            <ep-button variant="link" @click="toggleTavoitteet()">
              {{$t('avaa-sulje-kaikki')}}
            </ep-button>

            <ep-collapse
              ref="tavoitecollapse"
              v-for="(tavoite, index) in vlk.tavoitteet"
              :key="'tavoite'+index"
              :border-bottom="false"
              :expandedByDefault="vlk.tavoitteet.length === 1"
              :shadow="true">

              <template v-slot:header>
                <h3 v-html="$kaanna(tavoite.tavoite)"></h3>
              </template>

              <div v-if="tavoite.kohdealueet.length > 0" class="mb-4">
                <h4>{{$t('tavoitealue')}}</h4>
                <span v-html="$kaanna(kohdealueetById[tavoite.kohdealueet[0]].nimi)"></span>
              </div>

              <div class="mb-4">
                <h4>{{$t('tavoitteista-johdetut-oppimisen-tavoitteet')}}</h4>
                <span v-html="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)"></span>
              </div>

              <div class="mb-4" v-if="tavoite.sisaltoalueet.length > 0">
                <h4>{{$t('sisaltoalueet')}}</h4>

                <ep-collapse class="sisaltoalueet" v-for="(sisaltoalue, index) in tavoite.sisaltoalueet" :key="'lao'+index"
                  :borderBottom="false" :expanded-by-default="false" chevronLocation="left">
                  <template v-slot:header>
                    <h5 v-html="$kaanna(sisaltoalue.nimi)"></h5>
                  </template>

                  <div v-html="$kaanna(sisaltoalue.kuvaus)" />

                </ep-collapse>
              </div>

              <div class="mb-4" v-if="tavoite.laajattavoitteet.length > 0">
                <h4>{{$t('laaja-alaisen-osaamisen-alueet')}}</h4>

                <ep-collapse class="lao" v-for="(lao, index) in tavoite.laajattavoitteet" :key="'lao'+index"
                  :borderBottom="false" :expanded-by-default="false" chevronLocation="left">
                  <template v-slot:header>
                    <h5 v-html="$kaanna(lao.nimi)"></h5>
                  </template>

                  <div v-html="$kaanna(lao.kuvaus)" />

                </ep-collapse>

              </div>
                <div class="mt-4" v-if="tavoite.arvioinninKuvaus">
                  <h4>{{ $t('arvioinnin-kohde') }}</h4>
                  <span v-html="$kaanna(tavoite.arvioinninKuvaus)"></span>
                </div>

                <div class="mt-4" v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0">
                  <h4 class="mb-0 pb-0">{{$kaanna(tavoite.arvioinninOtsikko)}}</h4>
                  <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
                </div>

                <div class="mt-4" v-if="tavoite.vapaaTeksti">
                  <ep-content-viewer :value="$kaanna(tavoite.vapaaTeksti)" :kuvat="kuvat" :termit="termit"/>
                </div>

            </ep-collapse>

          </div>
        </b-tab>
      </b-tabs>

      <div class="mt-4" v-if="oppimaarat.length > 0">

        <h3>{{$t('oppimaarat')}}</h3>

        <b-table striped :items="oppimaarat" :fields="oppimaaratFields">
          <template v-slot:cell(nimi)="data">
            <router-link :to="data.item.route">
              {{$kaanna(data.item.nimi)}}
            </router-link>
          </template>

        </b-table>

      </div>

      <slot name="previous-next-navigation" />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusopetusOppiaineStore } from '@/stores/PerusopetusOppiaineStore';
import { Kielet } from '@shared/stores/kieli';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpArvioinninkohteetTable from '@shared/components/EpArvioinninkohteetTable/EpArvioinninkohteetTable.vue';
import { LaajaalainenOsaaminenDto } from '@shared/api/eperusteet';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
    EpCollapse,
    EpButton,
    EpArvioinninkohteetTable,
  },
} as any)
export default class RoutePerusopetusOppiaine extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private tabIndex = 0;

  mounted() {
    if (this.$route.params.vlkId && this.oppiaine) {
      const vlk = _.head(_.filter(this.oppiaine.vuosiluokkakokonaisuudet, vlk => _.toString(_.get(vlk, '_vuosiluokkaKokonaisuus')) === _.toString(this.$route.params.vlkId)));
      this.tabIndex = _.indexOf(this.oppiaine.vuosiluokkakokonaisuudet, vlk);
    }
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get laajaalaisetOsaamiset() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset') as any;
  }

  get perusteenOppiaine() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.oppiaineId }) as any;
  }

  get vuosiluokkakokonaisuudet() {
    return _.get(this.perusteenOppiaine, 'vuosiluokkakokonaisuudet');
  }

  get perusteenVuosiluokkakokonaisuudet() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto('perusopetus.vuosiluokkakokonaisuudet') as any;
  }

  get oppiaine() {
    const vuosiluokkakokonaisuudetById = _.keyBy(this.perusteenVuosiluokkakokonaisuudet, 'id');
    const laajaalaisetOsaamiset = _.keyBy(this.laajaalaisetOsaamiset, 'id');
    return {
      ...this.perusteenOppiaine,
      vuosiluokkakokonaisuudet: _.chain(this.vuosiluokkakokonaisuudet)
        .map(vlk => {
          const vlkSisaltoalueetById = _.keyBy(vlk.sisaltoalueet, 'id');
          return {
            ...vlk,
            nimi: _.get(vuosiluokkakokonaisuudetById[_.get(vlk, '_vuosiluokkaKokonaisuus')], 'nimi'),
            vuosiluokat: _.get(vuosiluokkakokonaisuudetById[_.get(vlk, '_vuosiluokkaKokonaisuus')], 'vuosiluokat'),
            tavoitteet: _.map(vlk.tavoitteet, tavoite => {
              return {
                ...tavoite,
                laajattavoitteet: _.chain(tavoite.laajattavoitteet)
                  .map((laajatavoitet: string) => {
                    return laajaalaisetOsaamiset[laajatavoitet] as LaajaalainenOsaaminenDto;
                  })
                  .sortBy((ltavoite: any) => ltavoite.nimi[Kielet.getSisaltoKieli.value])
                  .value() as any,
                sisaltoalueet: _.chain(tavoite.sisaltoalueet)
                  .map((sisaltoalue: string) => {
                    return vlkSisaltoalueetById[sisaltoalue];
                  })
                  .sortBy((sisaltoalue: any) => sisaltoalue.nimi[Kielet.getSisaltoKieli.value])
                  .value() as any,
              };
            }),
          };
        })
        .sortBy('vuosiluokat')
        .value(),
    };
  }

  hasContent(obj) {
    return _.isObject(obj) && _.get(obj, 'teksti') && _.get(obj, 'teksti')[Kielet.getSisaltoKieli.value];
  }

  get oppimaaratFields() {
    return [{
      key: 'nimi',
      thStyle: {
        display: 'none',
      },
    }];
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get oppimaarat() {
    return _.map(this.oppiaine!.oppimaarat, oppimaara => {
      return {
        ...oppimaara,
        route: {
          name: this.$route.params.vlkId ? 'vuosiluokanoppiaine' : 'perusopetusoppiaine',
          params: {
            oppiaineId: _.toString(oppimaara.id),
            ...(this.$route.params.vlkId && { vlkId: this.$route.params.vlkId }),
          },
        },
      };
    });
  }

  toggleTavoitteet() {
    _.forEach(this.$refs.tavoitecollapse, (tavoite: any) => tavoite.toggle());
  }

  get kohdealueetById() {
    if (this.oppiaine) {
      return _.keyBy(this.oppiaine.kohdealueet, 'id');
    }
    else {
      return {};
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;

    ::v-deep .nav-tabs li a {
      margin-left: 0px !important;
    }

    ::v-deep .ep-button .btn  {
      padding-left: 0 !important;
      .teksti {
        padding-left: 0 !important;
      }
    }

    .lao, .sisaltoalueet {
      ::v-deep .ep-collapse {
        padding-top: 0px !important;
        padding-bottom: 0px !important;
      }
    }
  }
</style>

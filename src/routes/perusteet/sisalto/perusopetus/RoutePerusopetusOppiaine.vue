<template>
  <div class="content">
    <ep-spinner v-if="!oppiaine" />

    <div v-else>
      <h2>{{ $kaanna(oppiaine.nimi) }}</h2>

      <div
        v-if="hasContent(oppiaine.tehtava)"
        class="mt-4"
      >
        <h3>{{ $kaanna(oppiaine.tehtava.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.tehtava.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <template v-if="oppiaine.vapaatTekstit">
        <div
          v-for="(vapaaTeksti, index) in oppiaine.vapaatTekstit"
          :key="'vapaateksti'+index"
          class="mt-4"
        >
          <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vapaaTeksti.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </div>
      </template>

      <b-tabs
        v-model="tabIndex"
        class="ml-0 pl-0 mt-4"
      >
        <b-tab
          v-for="(vlk, index) in oppiaine.vuosiluokkakokonaisuudet"
          :key="'vlk'+index"
          class="mt-4"
          :title="$kaanna(vlk.nimi)"
        >
          <h2>{{ $kaanna(vlk.nimi) }}</h2>

          <div
            v-if="hasContent(vlk.tehtava)"
            class="mt-4"
          >
            <h3>{{ $kaanna(vlk.tehtava.otsikko) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vlk.tehtava.teksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <div
            v-if="hasContent(vlk.tyotavat)"
            class="mt-4"
          >
            <h3>{{ $kaanna(vlk.tyotavat.otsikko) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vlk.tyotavat.teksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <div
            v-if="hasContent(vlk.ohjaus)"
            class="mt-4"
          >
            <h3>{{ $kaanna(vlk.ohjaus.otsikko) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vlk.ohjaus.teksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <div
            v-if="hasContent(vlk.arviointi)"
            class="mt-4"
          >
            <h3>{{ $kaanna(vlk.arviointi.otsikko) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vlk.arviointi.teksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <template v-if="vlk.vapaatTekstit">
            <div
              v-for="(vapaaTeksti, index) in vlk.vapaatTekstit"
              :key="'vlk-vapaateksti'+index"
              class="mt-4"
            >
              <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
              <ep-content-viewer
                :value="$kaanna(vapaaTeksti.teksti)"
                :kuvat="kuvat"
                :termit="termit"
              />
            </div>
          </template>

          <div
            v-if="hasContent(vlk.sisaltoalueinfo)"
            class="mt-4"
          >
            <h3>{{ $kaanna(vlk.sisaltoalueinfo.otsikko) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vlk.sisaltoalueinfo.teksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <div
            v-if="vlk.tavoitteet.length > 0"
            class="mt-4"
          >
            <h3>{{ $t('oppiaineen-tavoitteet') }}</h3>
            <ep-button
              variant="link"
              @click="toggleTavoitteet()"
            >
              {{ $t('avaa-sulje-kaikki') }}
            </ep-button>

            <ep-collapse
              v-for="(tavoite, index) in vlk.tavoitteet"
              ref="tavoitecollapse"
              :key="'tavoite'+index"
              :border-bottom="false"
              :expanded-by-default="vlk.tavoitteet.length === 1"
              :shadow="true"
            >
              <template #header>
                <h3 v-html="$kaanna(tavoite.tavoite)" />
              </template>

              <div
                v-if="tavoite.oppiaineenTavoitteenOpetuksenTavoitteet && tavoite.oppiaineenTavoitteenOpetuksenTavoitteet.length > 0"
                class="mb-4"
              >
                <h4>{{ $t('opetuksen-tavoitteet') }}</h4>
                <div
                  v-for="(otavoite, index) in tavoite.oppiaineenTavoitteenOpetuksenTavoitteet"
                  :key="'ot'+index"
                  class="mt-3"
                >
                  <span v-html="$kaanna(otavoite.tavoite)" />
                </div>
              </div>

              <div
                v-if="tavoite.kohdealueet.length > 0"
                class="mb-4"
              >
                <h4>{{ $t('tavoitealue') }}</h4>
                <span v-html="$kaanna(kohdealueetById[tavoite.kohdealueet[0]].nimi)" />
              </div>

              <div
                v-if="tavoite.tavoitteistaJohdetutOppimisenTavoitteet"
                class="mb-4"
              >
                <h4>{{ $t('tavoitteista-johdetut-oppimisen-tavoitteet') }}</h4>
                <span v-html="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)" />
              </div>

              <div
                v-if="tavoite.sisaltoalueet.length > 0"
                class="mb-4"
              >
                <h4>{{ $t('sisaltoalueet') }}</h4>

                <ep-collapse
                  v-for="(sisaltoalue, index) in tavoite.sisaltoalueet"
                  :key="'lao'+index"
                  class="sisaltoalueet"
                  :border-bottom="false"
                  :expanded-by-default="false"
                  chevron-location="left"
                >
                  <template #header>
                    <h5 v-html="$kaanna(sisaltoalue.nimi)" />
                  </template>

                  <div v-html="$kaanna(sisaltoalue.kuvaus)" />
                </ep-collapse>
              </div>

              <div
                v-if="tavoite.laajattavoitteet.length > 0"
                class="mb-4"
              >
                <h4>{{ $t('laaja-alaisen-osaamisen-alueet') }}</h4>

                <ep-collapse
                  v-for="(lao, index) in tavoite.laajattavoitteet"
                  :key="'lao'+index"
                  class="lao"
                  :border-bottom="false"
                  :expanded-by-default="false"
                  chevron-location="left"
                >
                  <template #header>
                    <h5 v-html="$kaanna(lao.nimi)" />
                  </template>

                  <div v-html="$kaanna(lao.kuvaus)" />
                </ep-collapse>
              </div>
              <div
                v-if="tavoite.arvioinninKuvaus"
                class="mt-4"
              >
                <h4>{{ $t('arvioinnin-kohde') }}</h4>
                <span v-html="$kaanna(tavoite.arvioinninKuvaus)" />
              </div>

              <div
                v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0"
                class="mt-4"
              >
                <h4 class="mb-0 pb-0">
                  {{ $kaanna(tavoite.arvioinninOtsikko) }}
                </h4>
                <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
              </div>

              <div
                v-if="tavoite.vapaaTeksti"
                class="mt-4"
              >
                <ep-content-viewer
                  :value="$kaanna(tavoite.vapaaTeksti)"
                  :kuvat="kuvat"
                  :termit="termit"
                />
              </div>
            </ep-collapse>
          </div>
        </b-tab>
      </b-tabs>

      <div
        v-if="oppimaarat.length > 0"
        class="mt-4"
      >
        <h3>{{ $t('oppimaarat') }}</h3>

        <div
          v-for="oppimaara in oppimaarat"
          :key="'oppimaara'+oppimaara.id"
          class="taulukko-rivi-varitys px-2 py-3"
        >
          <router-link :to="oppimaara.route">
            {{ $kaanna(oppimaara.nimi) }}
          </router-link>
        </div>
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
                  .map((sisaltoalue: string) => vlkSisaltoalueetById[sisaltoalue])
                  .reject(_.isNil)
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
    return obj?.teksti && _.get(obj, 'teksti')[Kielet.getSisaltoKieli.value];
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
    return _.chain(this.oppiaine!.oppimaarat)
      .filter(oppimaara => _.includes(_.map(oppimaara.vuosiluokkakokonaisuudet, '_vuosiluokkaKokonaisuus'), _.toString(this.$route.params.vlkId)))
      .map(oppimaara => {
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
      })
      .value();
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

<template>
  <div>
    <ep-spinner v-if="!koulutustoimija" />
    <div v-else>
      <ep-header
        :murupolku="murupolku"
        :koulutustyyppi="koulutustyyppi"
      >
        <template slot="header">
          {{ $kaanna(koulutustoimija.nimi) }}
        </template>
      </ep-header>
      <div class="container-md mt-4">
        <div
          v-if="koulutustoimija.kuvaus"
          class="mb-5"
        >
          <h2>{{ $t('kuvaus') }}</h2>
          <div v-html="$kaanna(koulutustoimija.kuvaus)" />
        </div>

        <div
          v-if="!koulutustoimija.organisaatioRyhma"
          class="mb-5"
        >
          <h2>{{ $t('koulutuksen-jarjestajan-yhteinen-osuus') }}</h2>

          <ep-spinner v-if="!yhteisetOsuudet" />
          <div v-else-if="yhteisetOsuudet.length === 0">
            {{ $t('koulutuksen-jarjestaja-ei-ole-lisannyt-yhteista-osuutta') }}
          </div>
          <div v-else>
            <span v-if="yhteisetOsuudet.length === 1">{{ $t('koulutuksen-jarjestaja-otsikko-selite-lyhyt') }}</span>
            <div v-else>
              <span
                v-if="naytaOtsikkoKaikki"
                v-html="$t('koulutuksen-jarjestaja-otsikko-selite')"
              />
              <span
                v-else
                v-html="$t('koulutuksen-jarjestaja-otsikko-selite-vahemman')"
              />

              <ep-button
                v-if="naytaOtsikkoKaikki"
                variant="link"
                @click="naytaOtsikkoKaikki = !naytaOtsikkoKaikki"
              >
                {{ $t('nayta-vahemman') }}
              </ep-button>
              <ep-button
                v-else
                variant="link"
                @click="naytaOtsikkoKaikki = !naytaOtsikkoKaikki"
              >
                {{ $t('nayta-lisaa') }}
              </ep-button>
            </div>

            <ep-search
              v-model="query"
              class="mt-3 mb-3"
              :placeholder="$t('etsi-yhteista-osuutta')"
            />
            <ep-ammatillinen-row
              v-for="(yhteinenOsuus, idx) in yhteisetOsuudetPaginated"
              :key="'yhteinenOsuus' + idx"
              :route="yhteinenOsuus.route"
            >
              <div class="nimi">
                {{ $kaanna(yhteinenOsuus.nimi) }}
              </div>
            </ep-ammatillinen-row>
            <b-pagination
              v-model="page"
              class="mt-4"
              :total-rows="yhteisetOsuudetFiltered.length"
              :per-page="perPage"
              align="center"
              aria-controls="yhteisetosuudet-lista"
              :first-text="$t('alkuun')"
              prev-text="«"
              next-text="»"
              :last-text="$t('loppuun')"
            />
          </div>
        </div>

        <h2>{{ $t('toteutussuunnitelmat') }}</h2>

        <ep-spinner v-if="!toteutussuunnitelmat" />
        <div v-else>
          <ep-search
            v-model="opsQuery"
            class="mb-3"
            :placeholder="$t('etsi-toteutussuunnitelmaa')"
          />
          <div v-if="toteutussuunnitelmat.length === 0 && opsQuery === ''">
            <div class="alert alert-info">
              {{ $t('ei-paikallisia-opetussuunnitelmia') }}
            </div>
          </div>
          <div v-else-if="toteutussuunnitelmat.length === 0 && opsQuery !== ''">
            <div class="alert alert-info">
              {{ $t('ei-hakutuloksia') }}
            </div>
          </div>
          <div
            v-else
            :class="{'disabled-events': !toteutussuunnitelmat}"
          >
            <div
              v-for="(ops, idx) in toteutussuunnitelmat"
              :key="idx"
            >
              <router-link :to="ops.route">
                <opetussuunnitelma-tile
                  :ops="ops"
                  :query="opsQuery"
                />
              </router-link>
            </div>
            <EpBPagination
              v-model="opsPage"
              :items-per-page="perPage"
              :total="toteutussuunnitelmaTotal"
              aria-controls="toteutussuunnitelmat-lista"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { KoulutuksenJarjestajaStore } from '@/stores/KoulutuksenJarjestajaStore';
import { Meta } from '@shared/utils/decorators';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';
import OpetussuunnitelmaTile from '@/routes/kooste/OpetussuunnitelmaTile.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { murupolkuKoulutuksenJarjestaja } from '@/utils/murupolku';

@Component({
  components: {
    EpHeader,
    EpSpinner,
    EpButton,
    EpAmmatillinenRow,
    EpSearch,
    OpetussuunnitelmaTile,
    EpBPagination,
  },
})
export default class RouteKoulutuksenJarjestaja extends Vue {
  @Prop({ required: true })
  private koulutuksenJarjestajaStore!: KoulutuksenJarjestajaStore;

  private naytaOtsikkoKaikki = false;
  private query = '';
  private page = 1;

  private opsQuery = '';
  private opsPage = 1;
  private perPage = 5;

  get koulutustyyppi() {
    return 'ammatillinen';
  }

  get koulutustoimija() {
    return this.koulutuksenJarjestajaStore.koulutustoimija.value;
  }

  get yhteisetOsuudet() {
    if (this.koulutuksenJarjestajaStore.yhteisetOsuudet.value) {
      return _.map(this.koulutuksenJarjestajaStore.yhteisetOsuudet.value, yhteinenOsuus => {
        return {
          ...yhteinenOsuus,
          route: { name: 'toteutussuunnitelma',
            params: {
              toteutussuunnitelmaId: _.toString(yhteinenOsuus.id),
              koulutustyyppi: this.koulutustyyppi,
            },
          },
        };
      });
    }
  }

  get toteutussuunnitelmat() {
    if (this.koulutuksenJarjestajaStore.toteutussuunnitelmat.value) {
      return _.map(this.koulutuksenJarjestajaStore.toteutussuunnitelmat.value.data, toteutussuunnitelma => {
        return {
          ...toteutussuunnitelma,
          route: {
            name: 'toteutussuunnitelma',
            params: { toteutussuunnitelmaId: _.toString(toteutussuunnitelma.id),
              koulutustyyppi: this.koulutustyyppi,
            },
          },
        };
      });
    }
  }

  get toteutussuunnitelmaTotal() {
    return this.koulutuksenJarjestajaStore.toteutussuunnitelmat.value?.kokonaismäärä;
  }

  get yhteisetOsuudetFiltered() {
    return _.chain(this.yhteisetOsuudet)
      .filter(ops => Kielet.search(this.query, ops.nimi))
      .value();
  }

  get yhteisetOsuudetPaginated() {
    return _.chain(this.yhteisetOsuudetFiltered)
      .drop(this.perPage * (this.page - 1))
      .take(this.perPage)
      .value();
  }

  @Watch('opsQuery')
  async opsQueryChange() {
    this.opsPage = 1;
    await this.doFetch();
  }

  @Watch('opsPage')
  async pageChange() {
    await this.doFetch();
  }

  @Watch('kieli', { immediate: true })
  async onKieliChange() {
    await Promise.all([this.doFetch(), this.koulutuksenJarjestajaStore.fetch()]);
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  async doFetch() {
    await this.koulutuksenJarjestajaStore.fetchToteutussuunnitelmat(this.opsQuery, this.opsPage - 1);
  }

  get murupolku() {
    return murupolkuKoulutuksenJarjestaja(this.koulutustyyppi, this.koulutustoimija);
  }

  @Meta
  getMetaInfo() {
    if (this.koulutustoimija) {
      return {
        title: (this as any).$kaanna(this.koulutustoimija.nimi),
      };
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

::v-deep .ep-button .btn-link, ::v-deep .ep-button .btn-link .teksti {
  padding-left: 0px !important;
}

::v-deep .ammatillinen-row .ammatillinen-data {
  color: $paletti-blue;
}

.opetussuunnitelma {
  border: 1px solid #DADADA;
  border-radius: 2px;
  min-height: 80px;
  margin-bottom: 10px;
}

</style>

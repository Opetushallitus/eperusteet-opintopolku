<template>
  <div>
    <ep-spinner v-if="!koulutustoimija" />
    <div v-else>
      <ep-header :murupolku="murupolku" :koulutustyyppi="'ammatillinen'">
        <template slot="header">
          {{ $kaanna(this.koulutustoimija.nimi) }}
        </template>
      </ep-header>
      <div class="container-md">

        <h2>{{$t('koulutuksen-jarjestajan-yhteinen-osuus')}}</h2>

        <ep-spinner v-if="!yhteisetOsuudet" />
        <div v-else-if="yhteisetOsuudet.length === 0">{{$t('koulutuksen-jarjestaja-ei-ole-lisannyt-yhteista-osuutta')}}</div>
        <div v-else>
          <span v-if="yhteisetOsuudet.length === 1">{{$t('koulutuksen-jarjestaja-otsikko-selite-lyhyt')}}</span>
          <div v-else>
            <span v-if="naytaOtsikkoKaikki" v-html="$t('koulutuksen-jarjestaja-otsikko-selite')" />
            <span v-else v-html="$t('koulutuksen-jarjestaja-otsikko-selite-vahemman')" />

            <ep-button v-if="naytaOtsikkoKaikki" variant="link" @click="naytaOtsikkoKaikki = !naytaOtsikkoKaikki">{{$t('nayta-vahemman')}}</ep-button>
            <ep-button v-else variant="link" @click="naytaOtsikkoKaikki = !naytaOtsikkoKaikki">{{$t('nayta-lisaa')}}</ep-button>
          </div>

          <ep-search class="mt-3" v-model="query" :placeholder="$t('etsi-yhteista-osuutta')"/>
          <ep-ammatillinen-row v-for="(yhteinenOsuus, idx) in yhteisetOsuudetPaginated" :key="'yhteinenOsuus' + idx" :route="yhteinenOsuus.route">
            <div class="nimi">{{ $kaanna(yhteinenOsuus.nimi) }}</div>
          </ep-ammatillinen-row>
          <b-pagination v-model="page"
                        class="mt-4"
                        :total-rows="yhteisetOsuudetFiltered.length"
                        :per-page="perPage"
                        align="center"
                        aria-controls="yhteisetosuudet-lista"
                        :first-text="$t('alkuun')"
                        prev-text="«"
                        next-text="»"
                        :last-text="$t('loppuun')" />
        </div>

        <h2 class="mt-5">{{$t('toteutussuunnitelmat')}}</h2>

        <ep-spinner v-if="!toteutussuunnitelmat" />
        <div v-else>
          <ep-search class="mb-3" v-model="opsQuery" :placeholder="$t('etsi-toteutussuunnitelmaa')"/>
          <div v-if="toteutussuunnitelmat.length === 0">
            <div class="alert alert-info">
              {{ $t('ei-paikallisia-opetussuunnitelmia') }}
            </div>
          </div>
          <div v-else-if="toteutussuunnitelmatFiltered.length === 0">
            <div class="alert alert-info">
              {{ $t('ei-hakutuloksia') }}
            </div>
          </div>
          <div v-else>
            <div v-for="(ops, idx) in toteutussuunnitelmatPaginated" :key="idx">

              <router-link :to="ops.route">
                <opetussuunnitelma-tile :ops="ops" :query="opsQuery"/>
              </router-link>

            </div>
            <b-pagination v-model="opsPage"
                          class="mt-4"
                          :total-rows="toteutussuunnitelmatFiltered.length"
                          :per-page="perPage"
                          align="center"
                          aria-controls="toteutussuunnitelmat-lista"
                          :first-text="$t('alkuun')"
                          prev-text="«"
                          next-text="»"
                          :last-text="$t('loppuun')" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
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

@Component({
  components: {
    EpHeader,
    EpSpinner,
    EpButton,
    EpAmmatillinenRow,
    EpSearch,
    OpetussuunnitelmaTile,
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
              koulutustyyppi: 'ammatillinen',
            },
          },
        };
      });
    }
  }

  get toteutussuunnitelmat() {
    if (this.koulutuksenJarjestajaStore.toteutussuunnitelmat.value) {
      return _.map(this.koulutuksenJarjestajaStore.toteutussuunnitelmat.value, toteutussuunnitelma => {
        return {
          ...toteutussuunnitelma,
          route: {
            name: 'toteutussuunnitelma',
            params: { toteutussuunnitelmaId: _.toString(toteutussuunnitelma.id),
              koulutustyyppi: 'ammatillinen',
            },
          },
        };
      });
    }
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

  get toteutussuunnitelmatFiltered() {
    return _.chain(this.toteutussuunnitelmat)
      .filter(ops => Kielet.search(this.opsQuery, ops.nimi))
      .value();
  }

  get toteutussuunnitelmatPaginated() {
    return _.chain(this.toteutussuunnitelmatFiltered)
      .drop(this.perPage * (this.opsPage - 1))
      .take(this.perPage)
      .value();
  }

  get murupolku() {
    return [{
      label: 'ammatillinen-koulutus',
      location: {
        name: 'ammatillinenSelaus',
      },
    },
    {
      label: 'koulutuksen-jarjestajat',
      location: {
        name: 'ammatillinenKoulutuksenjarjestajat',
      },
    },
    {
      label: this.koulutustoimija!.nimi,
    },
    ];
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

<template>
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi">
    <template slot="header">
      {{ $t('kansalliset-osaamismerkit') }}
    </template>
    <template slot="subheader">
      {{ $t('osaamismerkit-kuvaus') }}
    </template>
    <div class="osaamismerkit">
      <div class="d-flex flex-lg-row flex-column mb-4">
        <b-form-group :label="$t('hae')" class="flex-fill" :aria-label="$t('hakuosio')">
          <ep-search v-model="query.nimi"
                     :max-width="true"
                     :sr-placeholder="$t('hae-osaamismerkkeja')"
                     :placeholder="$t('hae-osaamismerkkeja')"/>
        </b-form-group>

        <b-form-group :label="$t('kategoria')">
          <EpMultiSelect :is-editing="false"
                         :options="osaamismerkkiKategoriaOptions"
                         :placeholder="$t('kaikki')"
                         class="multiselect"
                         v-model="kategoria"
                         :searchable="false"
                         track-by="value"
                         label="text">
          </EpMultiSelect>
        </b-form-group>
      </div>

      <div class="osaamismerkki-container">
        <ep-spinner v-if="!osaamismerkit" />
        <div v-else-if="kokonaismaara === 0">
          <div class="alert alert-info">
            {{ $t('ei-hakutuloksia') }}
          </div>
        </div>
        <div v-else>
          <div v-for="(group, index) in osaamismerkit" :key="index" class="mb-5">
            <div class="mb-2">
              <h2>{{$kaanna(group[0].kategoria.nimi)}}</h2>
            </div>
            <div class="d-flex justify-content-start">
              <div v-for="(osaamismerkki, idx) in group" :key="idx">
                <router-link :to="{ name: 'osaamismerkki', params: { osaamismerkkiId: osaamismerkki.id } }">
                  <div class="tile tile-background-shadow-selected shadow-tile d-flex">
                    <div>
                      <img :src="osaamismerkki.image" width="40" height="40">
                    </div>
                    <div>
                      <span class="nimi">{{ $kaanna(osaamismerkki.nimi) }}</span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </ep-header>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { MurupolkuOsa } from '@/tyypit';
import { RawLocation } from 'vue-router';
import _ from 'lodash';
import { OsaamismerkitQuery } from '@shared/api/eperusteet';

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    OpetussuunnitelmaTile,
    EpMultiSelect,
    EpBPagination,
    EpVoimassaoloFilter,
  },
})
export default class RouteOsaamismerkit extends Vue {
  @Prop({ required: true })
  private osaamismerkitStore!: OsaamismerkitStore;

  private query = this.initQuery();
  private isLoading = false;
  private kategoria: any | null = null;

  async mounted() {
    await this.osaamismerkitStore.fetchKategoriat();
    await this.fetch();
  }

  async fetch() {
    await this.osaamismerkitStore.updateOsaamismerkkiQuery(this.query);
  }

  private initQuery() {
    return {
      sivu: 0,
      sivukoko: 9999,
      nimi: '',
      tila: ['JULKAISTU'],
      kategoria: undefined,
      voimassa: true,
      tuleva: false,
      poistunut: false,
    };
  }

  @Watch('query', { deep: true, immediate: true })
  async onQueryChange(query: OsaamismerkitQuery) {
    this.isLoading = true;
    await this.osaamismerkitStore.updateOsaamismerkkiQuery({
      ...query,
    });
    this.isLoading = false;
  }

  @Watch('kategoria')
  onKategoriaChange(kategoria) {
    this.query.kategoria = kategoria ? kategoria.value : null;
  }

  generateImageUrl(liite) {
    return liite ? 'data:' + liite.mime + ';base64,' + liite.binarydata : null;
  }

  get kokonaismaara() {
    return this.osaamismerkitStore.kokonaismaara.value;
  }

  get osaamismerkit() {
    return _.chain(this.osaamismerkitStore.osaamismerkit.value)
      .map(osaamismerkki => ({
        ...osaamismerkki,
        image: this.generateImageUrl(osaamismerkki.kategoria?.liite),
      }))
      .groupBy('kategoria.id')
      .value();
  }

  get koulutustyyppi() {
    return _.get(this.$route.params, 'koulutustyyppi') || 'vapaasivistystyo';
  }

  get osaamismerkkiKategoriat() {
    return _.chain(this.osaamismerkitStore.kategoriat.value)
      .map(kategoria => {
        return {
          text: this.$kaanna(kategoria.nimi),
          value: kategoria.id,
        };
      })
      .uniqWith(_.isEqual)
      .filter('text')
      .value();
  }

  get osaamismerkkiKategoriaOptions() {
    return [
      {
        text: this.$t('kaikki'),
        value: null,
      },
      ...this.osaamismerkkiKategoriat,
    ];
  }

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: this.koulutustyyppi,
      location: {
        ...this.$route,
      } as RawLocation,
    }, {
      label: 'kansalliset-osaamismerkit',
      location: {
        name: 'osaamismerkit',
      },
    }];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.test {
  justify-content: center;
}

.osaamismerkit {

  .tile {
    color: #212529;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid #E7E7E7;
    overflow-x: auto;
    width: 380px;
    height: 75px;
    padding-left: 20px;
    padding-right: 20px;
    align-items: center;
    margin-right: 15px;

    @media(max-width: 767.98px) {
      width: 100%;
    }
  }

  .nimi {
    font-size: 18px;
    font-weight: 600;
    margin-left: 15px;
  }

  ::v-deep .filter {
    max-width: 100%;
  }

  @media(min-width: 992px){
    .multiselect {
      width: 300px;
    }
  }
}
</style>

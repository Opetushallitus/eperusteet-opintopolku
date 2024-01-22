<template>
  <div v-if="$route.name === 'osaamismerkit'">
    <EpHeader :murupolku="murupolku" :koulutustyyppi="koulutustyyppi">
      <template slot="header">
        {{ $t('kansalliset-perustaitojen-osaamismerkit') }}
      </template>
      <template slot="subheader">
        {{ $t('osaamismerkit-kuvaus') }}
      </template>

      <div class="osaamismerkit">
        <div class="d-flex flex-lg-row flex-column mb-4">
          <b-form-group :label="$t('hae')" class="flex-fill" :aria-label="$t('hakuosio')">
            <EpSearch v-model="query.nimi"
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
          <EpSpinner v-if="!osaamismerkit" />
          <div v-else-if="osaamismerkitCount === 0">
            <div class="alert alert-info">
              {{ $t('ei-hakutuloksia') }}
            </div>
          </div>
          <div v-else>
            <div v-for="(group, index) in kategoriaGroup" :key="index" class="mb-4">
              <div class="mb-4">
                <h2>{{$kaanna(group.data.nimi)}}</h2>
              </div>
              <div class="mb-4" v-if="group.data.kuvaus">
                {{$kaanna(group.data.kuvaus)}}
              </div>
              <div class="d-md-flex flex-wrap justify-content-start">
                <div v-for="(osaamismerkki, idx) in group.osaamismerkit" :key="idx" class="mb-2">
                  <router-link :to="{ name: 'osaamismerkkiTiedot', params: { osaamismerkkiId: osaamismerkki.id } }">
                    <div class="tile tile-background-shadow-selected shadow-tile d-flex">
                      <div>
                        <img :src="osaamismerkki.image" width="40" height="40">
                      </div>
                      <div class="ml-3">
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
    </EpHeader>
  </div>
  <router-view v-else/>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import _ from 'lodash';
import { OsaamismerkitQuery } from '@shared/api/eperusteet';
import { Meta } from '@shared/utils/decorators';
import { murupolkuOsaamismerkkiRoot } from '@/utils/murupolku';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    EpMultiSelect,
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

  get osaamismerkit() {
    return _.chain(this.osaamismerkitStore.osaamismerkit.value)
      .map(osaamismerkki => ({
        ...osaamismerkki,
        image: this.generateImageUrl(osaamismerkki.kategoria?.liite),
      }))
      .sortBy(om => Kielet.sortValue(om.nimi))
      .value();
  }

  get osaamismerkitCount() {
    return this.osaamismerkitStore.osaamismerkit?.value?.length;
  }

  get kategoriaGroup() {
    return _.chain(this.osaamismerkkiKategoriat)
      .map(kategoria => ({
        ...kategoria,
        osaamismerkit: _.filter(this.osaamismerkit, osaamismerkki => osaamismerkki.kategoria?.id === kategoria.value),
      }))
      .filter(kategoria => kategoria.osaamismerkit.length > 0)
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
          data: kategoria,
        };
      })
      .uniqWith(_.isEqual)
      .sortBy('text')
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

  get murupolku() {
    return murupolkuOsaamismerkkiRoot(this.koulutustyyppi);
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('osaamismerkit'),
    };
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

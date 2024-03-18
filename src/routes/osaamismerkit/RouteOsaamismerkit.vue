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

          <b-form-group :label="$t('teema')">
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
        <EpOsaamismerkit :osaamismerkit-store="osaamismerkitStore"
                         :osaamismerkki-kategoriat="osaamismerkkiKategoriat"></EpOsaamismerkit>
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
import EpOsaamismerkit from '@/routes/osaamismerkit/EpOsaamismerkit.vue';

@Component({
  components: {
    EpOsaamismerkit,
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

::v-deep .filter {
  max-width: 100%;
}

::v-deep h4 {
  font-size: 1.25rem !important;
  font-weight: 500 !important;
}

@media(min-width: 992px){
  .multiselect {
    width: 300px;
  }
}
</style>

<template>
<div class="haku">
  <div class="search">

    <div v-if="tyyppi === 'peruste'">
      <div class="placeholderText">
        <span class="pr-1">{{searchPlaceholder}}</span>
        <span class="pr-1">{{$t('voit-hakea-tutkinnon-osia')}}</span>
        <EpSpinner v-if="!valmisteillaOlevat" small/>
        <span v-else-if="valmisteillaOlevat.data.length > 0">{{$t('katso-myos')}}
          <router-link class="w-100" :to="{name: 'ammatillinenValmisteillaOlevat'}">
            {{$t('valmisteilla-olevien-perusteiden-julkaisuaikataulu')}}
          </router-link>
        </span>
      </div>

      <div class="d-flex flex-lg-row flex-column" :class="{'disabled-events': !perusteetJaTutkinnonosat}">
        <EpSearch
          class="flex-fill ml-0 mt-3 mb-3 mr-3"
          v-model="query"
          :sr-placeholder="$t('tutkinnon-peruste-tai-tutkinnon-osa')"
          :placeholder="$t('')">
          <template #label>
            <span class="font-weight-600">{{ $t('tutkinnon-peruste-tai-tutkinnon-osa')}}</span>
          </template>
        </EpSearch>
        <EpMultiSelect
          class="multiselect ml-0 mt-3 mb-3"
          v-model="tutkintotyyppi"
          :enable-empty-option="true"
          :placeholder="$t('kaikki')"
          :is-editing="true"
          :options="tutkintotyypit"
          :searchable="false">

          <template #label>
            <span class="font-weight-600">{{ $t('tutkintotyyppi')}}</span>
          </template>

          <template slot="singleLabel" slot-scope="{ option }">
            {{ $t(option) }}
          </template>

          <template slot="option" slot-scope="{ option }">
            {{ $t(option) }}
          </template>
        </EpMultiSelect>
      </div>
    </div>

    <div v-else class="mb-3">
      <EpSearch
        v-model="query"
        :class="{'disabled-events': !perusteetJaTutkinnonosat}"/>
    </div>
    <EpSisaltotyyppiFilter v-if="tyyppi === 'peruste'" v-model="toggleQuery"></EpSisaltotyyppiFilter>
  </div>

  <EpHakutulosmaara :kokonaismaara="total" piilotaNakyvaTulosmaara/>

  <div v-if="!perusteetJaTutkinnonosat">
    <EpSpinner />
  </div>

  <div v-else class="content">
    <div class="perusteet" id="perusteet-lista">
      <EpAmmatillinenRow v-for="(sisalto, idx) in perusteetJaTutkinnonosat"
                           :key="idx"
                           :route="sisalto.route"
                           :class="sisalto.voimassaoloTieto[0].tyyppi">
        <div class="list-item-header">
          <div class="nimi">
            {{ $kaanna(sisalto.nimi) }}
            <div class="d-inline-flex">
              <span v-if="sisalto.laajuus">{{sisalto.laajuus}} {{$t('osaamispiste')}}</span>
            </div>
            <span v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'" class="koodi">({{ sisalto.tutkinnonosa.koodiArvo }})</span>
          </div>
          <div v-if="sisalto.tutkintotag">
            <span class="tutkinto w-40" :class="sisalto.sisaltotyyppi">{{ $t(sisalto.tutkintotag)}}</span>
          </div>
        </div>
        <EpAmmatillinenTutkinnonosaItem v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'" :sisalto="sisalto"></EpAmmatillinenTutkinnonosaItem>
        <EpAmmatillinenPerusteItem v-else :sisalto="sisalto"></EpAmmatillinenPerusteItem>
      </EpAmmatillinenRow>

    </div>
    <div class="pagination d-flex justify-content-center">
      <EpBPagination v-model="page"
                     :items-per-page="perPage"
                     :total="total"
                     aria-controls="perusteet-lista">
      </EpBPagination>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { IPerusteHakuStore } from '@/stores/IPerusteHakuStore';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { voimassaoloTieto } from '@/utils/voimassaolo';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpSisaltotyyppiFilter from '@shared/components/EpSisaltotyyppiFilter/EpSisaltotyyppiFilter.vue';
import EpAmmatillinenPerusteItem from '@/components/EpAmmatillinen/EpAmmatillinenPerusteItem.vue';
import EpAmmatillinenTutkinnonosaItem from '@/components/EpAmmatillinen/EpAmmatillinenTutkinnonosaItem.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';

@Component({
  components: {
    EpSearch,
    EpSpinner,
    EpAmmatillinenRow,
    EpMultiSelect,
    EpBPagination,
    EpSisaltotyyppiFilter,
    EpAmmatillinenPerusteItem,
    EpAmmatillinenTutkinnonosaItem,
    EpHakutulosmaara,
  },
})
export default class PerusteAmmatillinenHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: IPerusteHakuStore;

  @Prop({ type: String })
  private tyyppi!: 'peruste' | 'opas';

  private valmisteillaOlevatStore: ValmisteillaOlevatStore = new ValmisteillaOlevatStore();
  private tutkintotyyppi = 'kaikki';
  private query = '';

  private toggleQuery: any = {};

  async mounted() {
    this.initQuery();
    this.page = 1;
    await this.valmisteillaOlevatStore.fetch(0, 1, AmmatillisetKoulutustyypit);

    if (!this.perusteHakuStore.perusteet) {
      await this.perusteHakuStore.fetch();
    }
  }

  async updateFilters(filters) {
    if (_.size(filters.nimiTaiKoodi) === 0 || _.size(filters.nimiTaiKoodi) > 2) {
      await this.perusteHakuStore.updateFilters(filters);
    }
  }

  initQuery() {
    this.filters.nimiTaiKoodi = undefined;
    this.toggleQuery = {
      tuleva: true,
      voimassaolo: true,
      siirtyma: false,
      poistunut: false,
      perusteet: true,
      tutkinnonosat: false,
    };
  }

  get tutkintotyypit() {
    return [
      'kaikki',
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
    ];
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  @Watch('kieli')
  async kieliChange() {
    await this.updateFilters({ kieli: this.kieli });
  }

  @Watch('tutkintotyyppi')
  async tutkintotyyppiChange() {
    if (this.tutkintotyyppi === 'kaikki') {
      await this.updateFilters({ koulutustyyppi: [
        'koulutustyyppi_1',
        'koulutustyyppi_11',
        'koulutustyyppi_12',
        'koulutustyyppi_5',
        'koulutustyyppi_18',
      ] });
    }
    else {
      await this.updateFilters({ koulutustyyppi: [this.tutkintotyyppi] });
    }
  }

  @Watch('query')
  async onQueryChanged() {
    this.page = 1;
    await this.updateFilters({ nimiTaiKoodi: this.query });
  }

  @Watch('page')
  async onPageChanged() {
    await this.updateFilters({ sivu: this.perusteHakuStore.page });
    (this.$el.querySelector('.ammatillinen-row a') as any)?.focus();
  }

  @Watch('toggleQuery', { deep: true })
  async voimassaoloFilterChanged() {
    await this.updateFilters(this.toggleQuery);
    this.page = 1;
  }

  get searchPlaceholder() {
    if (this.tyyppi === 'opas') {
      return this.$t('ohjeen-tai-materiaalin-nimi');
    }
    else {
      return this.$t('voit-hakea-tutkintoa-nimella');
    }
  }

  get perusteetJaTutkinnonosat() {
    if (this.perusteHakuStore.perusteet) {
      return this.mapPerusteet(this.perusteHakuStore.perusteet);
    }
  }

  mapPerusteet(perusteet) {
    return _.chain(perusteet)
      .map(sisalto => ({
        ...sisalto,
        route: this.perusteTutkinnonosaRoute(sisalto),
        voimassaoloTieto: voimassaoloTieto(sisalto),
        koulutuskoodit: _.join(_.map(sisalto.koulutukset, 'koulutuskoodiArvo'), ', '),
        perusteet: sisalto.perusteet ? this.mapPerusteet(sisalto.perusteet) : null,
        ...(sisalto.sisaltotyyppi === 'peruste' && sisalto.tyyppi !== 'opas' && { tutkintotag: 'tutkinnon-peruste' }),
        ...(sisalto.sisaltotyyppi === 'tutkinnonosa' && { tutkintotag: 'tutkinnon-osa' }),

      }))
      .value();
  }

  perusteTutkinnonosaRoute(perusteTaiTutkinnonosa) {
    if (perusteTaiTutkinnonosa.sisaltotyyppi === 'tutkinnonosa' && perusteTaiTutkinnonosa.tutkinnonosa?.tyyppi === 'normaali' && perusteTaiTutkinnonosa.perusteet?.length > 1) {
      return null;
    }
    if (perusteTaiTutkinnonosa.tutkinnonosa?.tyyppi === 'reformi_tutke2') {
      return {
        name: 'yhteinentutkinnonosa',
        params: {
          koodi: perusteTaiTutkinnonosa.tutkinnonosa.koodiUri,
        },
      };
    }
    if (perusteTaiTutkinnonosa.perusteet?.length === 1) {
      return {
        name: 'tutkinnonosa',
        params: {
          perusteId: perusteTaiTutkinnonosa.perusteet[0].id,
          tutkinnonOsaViiteId: perusteTaiTutkinnonosa.id,
        },
        query: { redirect: 'true' },
      };
    }
    if (this.tyyppi === 'opas') {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: 'ammatillinen',
          perusteId: _.toString(perusteTaiTutkinnonosa.id || perusteTaiTutkinnonosa.perusteId),
        },
      };
    }
    else {
      return {
        name: 'ammatillinenkooste',
        params: {
          perusteId: _.toString(perusteTaiTutkinnonosa.id),
        },
      };
    }
  }

  get total() {
    return this.perusteHakuStore.total;
  }

  get pages() {
    return this.perusteHakuStore.pages;
  }

  get perPage() {
    return this.perusteHakuStore.perPage;
  }

  get filters() {
    return this.perusteHakuStore.filters;
  }

  get page() {
    return this.perusteHakuStore.page + 1;
  }

  set page(value) {
    this.perusteHakuStore.page = value - 1;
  }

  get valmisteillaOlevat() {
    return this.valmisteillaOlevatStore.perusteet.value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.placeholderText {
  font-size: small;
}

@media(min-width: 992px){
  .multiselect {
    width: 400px;
  }
}

.list-item-header {
  display: flex;

  @media(max-width: 992px){
    justify-content: space-between;
  }
}

.haku {
  width: 100%;

  ::v-deep .filter {
    max-width: 100%;
  }

  .nimi {
    font-weight: 600;
    margin-bottom: 5px;
    margin-right: 10px;

    @media(max-width: 992px){
      width: 60%;
    }
  }

  .pagination {
    margin-top: 10px;
  }
}

.tutkinto {
  padding: 3px 12px;
  color: $white;
  border-radius: 12px;
  font-size: 12px;

  &.peruste {
    background: $blue-darken-1;
  }
  &.tutkinnonosa {
    background: $green;
  }
}

.koodi {
  margin-left: 5px;
  font-weight: 300;
  color: $gray;
}

</style>

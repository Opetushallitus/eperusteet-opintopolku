<template>
<div class="haku">
  <div class="search">

    <div v-if="tyyppi === 'peruste'">
      <div class="placeholderText">
        <span class="pr-1">{{searchPlaceholder}}</span>
        <ep-spinner v-if="!valmisteillaOlevat" small/>
        <span v-else-if="valmisteillaOlevat.data.length > 0">{{$t('katso-myos')}}
          <router-link class="w-100" :to="{name: 'ammatillinenValmisteillaOlevat'}">
            {{$t('valmisteilla-olevien-perusteiden-julkaisuaikataulu')}}
          </router-link>
        </span>
      </div>

      <div class="d-flex flex-lg-row flex-column" :class="{'disabled-events': !perusteet}">
        <b-form-group :label="$t('hae')" class="flex-fill" :aria-label="$t('hakuosio')">
          <EpSearch v-model="query"
                    :sr-placeholder="$t('hae-perustetta')"
                    :placeholder="$t('hae-perustetta')"/>
        </b-form-group>
        <b-form-group :label="$t('tutkintotyyppi')">
          <EpMultiSelect
            class="multiselect"
            v-model="tutkintotyyppi"
            :enable-empty-option="true"
            :placeholder="$t('kaikki')"
            :is-editing="true"
            :options="tutkintotyypit"
            :searchable="false">

            <template slot="singleLabel" slot-scope="{ option }">
              {{ $t(option) }}
            </template>

            <template slot="option" slot-scope="{ option }">
              {{ $t(option) }}
            </template>
          </EpMultiSelect>
        </b-form-group>
      </div>
    </div>

    <div v-else class="mb-3">
      <EpSearch v-model="query" :class="{'disabled-events': !perusteet}"/>
    </div>

    <EpVoimassaoloFilter v-if="tyyppi === 'peruste'" v-model="voimassaoloQuery"></EpVoimassaoloFilter>
  </div>
  <div v-if="!perusteet">
    <ep-spinner />
  </div>
  <div v-else class="content">
    <div class="perusteet" id="perusteet-lista">

      <ep-ammatillinen-row v-for="(peruste, idx) in perusteet" :key="idx" :route="peruste.route" :class="peruste.voimassaoloTieto[0].tyyppi">
        <div class="nimi">{{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{peruste.laajuus}} {{$t('osaamispiste')}}</span></div>
        <div class="nimikkeet" v-if="peruste.tutkintonimikkeet && peruste.tutkintonimikkeet.length > 0">
          <span class="kohde">{{ $t('tutkintonimikkeet') }}:</span>
          <span v-for="(tutkintonimike, tidx) in peruste.tutkintonimikkeet" :key="tidx">
            {{ $kaanna(tutkintonimike.nimi) }}
          </span>
        </div>
        <div class="nimikkeet" v-if="peruste.osaamisalat && peruste.osaamisalat.length > 0">
          <span class="kohde">{{ $t('osaamisalat') }}:</span>
          <span v-for="(osaamisala, oidx) in peruste.osaamisalat" :key="oidx">
            {{ $kaanna(osaamisala.nimi) }}
          </span>
        </div>
        <div class="alatiedot">
          <span v-for="(voimassaolotieto,index) in peruste.voimassaoloTieto" :key="'voimassa' + index">
            <span v-if="index > 0">|</span>
            {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
          </span>
          <EpVoimassaolo :voimassaolo="peruste"></EpVoimassaolo>
          <span v-if="peruste.diaarinumero">
            | {{$t('diaarinumero')}}: {{ peruste.diaarinumero }}
          </span>
          <span v-if="peruste.koulutukset && peruste.koulutukset.length > 0">
            <template v-if="peruste.koulutukset.length >  1">
            | {{$t('koulutuskoodit')}}: {{ peruste.koulutuskoodit }}
            </template>
            <template v-else>
            | {{$t('koulutuskoodi')}}: {{ peruste.koulutuskoodit }}
            </template>
          </span>
        </div>
      </ep-ammatillinen-row>

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
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { IPerusteHakuStore } from '@/stores/IPerusteHakuStore';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import _ from 'lodash';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { voimassaoloTieto } from '@/utils/voimassaolo';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';

@Component({
  components: {
    EpToggle,
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    EpAmmatillinenRow,
    EpMultiSelect,
    EpBPagination,
    EpVoimassaoloFilter,
    EpVoimassaolo,
  },
})
export default class PerusteAmmatillinenHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: IPerusteHakuStore;

  @Prop({ type: String })
  private tyyppi!: 'peruste' | 'opas' | 'kooste';

  private valmisteillaOlevatStore: ValmisteillaOlevatStore = new ValmisteillaOlevatStore();
  private tutkintotyyppi = 'kaikki';

  private voimassaoloQuery: any = {
    tuleva: true,
    voimassaolo: true,
    siirtyma: false,
    poistunut: false,
  };

  async mounted() {
    this.page = 1;
    if (!this.perusteHakuStore.perusteet) {
      await this.perusteHakuStore.fetch();
    }
    await this.valmisteillaOlevatStore.fetch(0, 1, AmmatillisetKoulutustyypit);
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
    this.perusteHakuStore.updateFilters({ kieli: this.kieli });
  }

  @Watch('tutkintotyyppi')
  tutkintotyyppiChange() {
    if (this.tutkintotyyppi === 'kaikki') {
      this.perusteHakuStore.updateFilters({ koulutustyyppi: [
        'koulutustyyppi_1',
        'koulutustyyppi_11',
        'koulutustyyppi_12',
        'koulutustyyppi_5',
        'koulutustyyppi_18',
      ] });
    }
    else {
      this.perusteHakuStore.updateFilters({ koulutustyyppi: [this.tutkintotyyppi] });
    }
  }

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }

  @Watch('voimassaoloQuery', { deep: true })
  voimassaoloFilterChanged() {
    this.perusteHakuStore.updateFilters(this.voimassaoloQuery);
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

  get perusteet() {
    if (this.perusteHakuStore.perusteet) {
      return _.chain(this.perusteHakuStore.perusteet)
        .map(peruste => ({
          ...peruste,
          route: this.perusteRoute(peruste),
          voimassaoloTieto: voimassaoloTieto(peruste),
          koulutuskoodit: _.join(_.map(peruste.koulutukset, 'koulutuskoodiArvo'), ', '),
        }))
        .value();
    }
  }

  perusteRoute(peruste) {
    if (this.tyyppi === 'opas' || this.tyyppi === 'kooste') {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: 'ammatillinen',
          perusteId: _.toString(peruste.id || peruste.perusteId),
        },
      };
    }
    else {
      return {
        name: 'ammatillinenkooste',
        params: {
          perusteId: _.toString(peruste.id),
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

  get query() {
    return this.filters.nimi;
  }

  set query(value) {
    this.perusteHakuStore.updateFilters({ nimi: value });
  }

  get page() {
    return this.perusteHakuStore.page + 1;
  }

  set page(value) {
    this.perusteHakuStore.page = value - 1;
    this.perusteHakuStore.updateFilters({ sivu: this.perusteHakuStore.page });
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

.haku {
  width: 100%;

  ::v-deep .filter {
    max-width: 100%;
  }

  .nimi {
    font-weight: 600;
    margin-bottom: 5px;
  }

  .nimikkeet {
    font-size: small;
    padding-bottom: 5px;

    .kohde {
      font-weight: 600;
    }
  }

  .alatiedot {
    font-size: smaller;
  }

  .pagination {
    margin-top: 10px;
  }
}
</style>

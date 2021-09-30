<template>
<div class="haku">
  <div class="search">

    <div v-if="tyyppi === 'peruste'">
      <div class="placeholderText d-flex">
        <span class="pr-1">{{searchPlaceholder}}</span>
        <ep-spinner v-if="!valmisteillaOlevat" small/>
        <span v-else-if="valmisteillaOlevat.data.length > 0">{{$t('katso-myos')}}
          <router-link class="w-100" :to="{name: 'ammatillinenValmisteillaOlevat'}">
            {{$t('valmisteilla-olevien-perusteiden-julkaisuaikataulu')}}
          </router-link>
        </span>
      </div>

      <div class="d-flex flex-lg-row flex-column" :class="{'disabled-events': !perusteet}">
        <b-form-group :label="$t('hae')" class="flex-fill">
          <ep-search v-model="query" />
        </b-form-group>
        <b-form-group :label="$t('tutkintotyyppi')">
          <EpMultiSelect
            class="multiselect"
            v-model="tutkintotyyppi"
            :enable-empty-option="true"
            :placeholder="$t('kaikki')"
            :is-editing="true"
            :options="tutkintotyypit">

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

    <ep-search v-else v-model="query" :placeholder="searchPlaceholder" :class="{'disabled-events': !perusteet}"/>

    <div class="checkboxes d-flex align-self-center flex-wrap flex-lg-row flex-column" :class="{'disabled-events': !perusteet}">
      <ep-toggle v-for="(toggle, idx) in toggles"
                 :key="idx"
                 v-model="filters[toggle]"
                 @input="onToggleChange()"
                 :isSWitch="false">
        {{ $t('switch-' + toggle) }}
      </ep-toggle>
    </div>
  </div>
  <div v-if="!perusteet">
    <ep-spinner />
  </div>
  <div v-else class="content">
    <div class="perusteet" id="perusteet-lista">

      <ep-ammatillinen-row v-for="(peruste, idx) in perusteet" :key="idx" :route="peruste.route">
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
        <div class="voimaantulo" v-if="peruste.voimassaoloAlkaa">
          {{$t('voimaantulo')}} {{ $sd(peruste.voimassaoloAlkaa) }}
        </div>
      </ep-ammatillinen-row>

    </div>
    <div class="pagination d-flex justify-content-center">
      <b-pagination v-model="page"
                    :total-rows="total"
                    :per-page="perPage"
                    align="center"
                    aria-controls="perusteet-lista"
                    :first-text="$t('alkuun')"
                    prev-text="«"
                    next-text="»"
                    :last-text="$t('loppuun')" />
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
import { ammatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpToggle,
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    EpAmmatillinenRow,
    EpMultiSelect,
  },
})
export default class PerusteAmmatillinenHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: IPerusteHakuStore;

  @Prop({ type: String })
  private tyyppi!: 'peruste' | 'opas' | 'kooste';

  private valmisteillaOlevatStore: ValmisteillaOlevatStore = new ValmisteillaOlevatStore();

  async mounted() {
    await this.perusteHakuStore.fetch();
    await this.valmisteillaOlevatStore.fetch(0, 1, ammatillisetKoulutustyypit);
  }

  private tutkintotyyppi = 'kaikki';

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

  get searchPlaceholder() {
    if (this.tyyppi === 'opas') {
      return this.$t('ohjeen-tai-materiaalin-nimi');
    }
    else {
      return this.$t('etsi-ammatillinen-tutkinto-peruste-placeholder');
    }
  }

  get toggles() {
    return this.perusteHakuStore.toggles;
  }

  get perusteet() {
    if (this.perusteHakuStore.perusteet) {
      return _.chain(this.perusteHakuStore.perusteet)
        .map(peruste => ({
          ...peruste,
          route: this.perusteRoute(peruste),
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
          perusteId: _.toString(peruste.perusteId),
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

  async onToggleChange(toggle) {
    this.perusteHakuStore.updateFilters(this.filters);
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
  color: #555;
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

  .checkboxes {
    padding: 10px;
    .custom-switch {
      margin: 5px 15px 0 0;
    }
  }

  .nimi {
    font-size: normal;
    font-weight: bolder;
    margin-bottom: 8px;
  }
  .nimikkeet {
    font-size: small;

    .kohde {
      font-weight: 600;
    }
  }
  .voimaantulo {
    font-size: smaller;
    color: #666;
    padding-top: 10px;
  }

  .pagination {
    margin-top: 10px;
  }
}

</style>

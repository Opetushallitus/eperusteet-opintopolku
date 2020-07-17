<template>
<div class="haku">
  <div class="search">
    <ep-search v-model="query" :placeholder="searchPlaceholder"/>
    <div class="checkboxes d-flex align-self-center flex-wrap">
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
        <div class="nimi">{{ $kaanna(peruste.nimi) }}</div>
        <div class="nimikkeet" v-if="peruste.tutkintonimikeKoodit && peruste.tutkintonimikeKoodit.length > 0">
          <span class="kohde">{{ $t('tutkintonimikkeet') }}:</span>
          <span v-for="(tutkintonimike, tidx) in peruste.tutkintonimikeKoodit" :key="tidx">
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
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import _ from 'lodash';
import { ENV_PREFIX } from '@shared/utils/defaults';
import { Kielet } from '@shared/stores/kieli';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';

@Component({
  components: {
    EpToggle,
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    EpAmmatillinenRow,
  },
})
export default class PerusteAmmatillinenHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: PerusteHakuStore;

  @Prop({ type: String })
  private tyyppi!: 'peruste' | 'opas' | 'kooste';

  mounted() {
    this.perusteHakuStore.fetch();
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
          perusteId: peruste.id,
        },
      };
    }
    else {
      return {
        name: 'ammatillinenkooste',
        params: { perusteId: peruste.id },
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
    this.perusteHakuStore.fetch();
  }

  onToggleChange(toggle) {
    this.perusteHakuStore.fetch();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

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

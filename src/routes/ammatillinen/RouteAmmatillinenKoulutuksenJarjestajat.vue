<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-jarjestajat') }}</p>

  <div v-if="!koulutustoimijat">
    <ep-spinner />
  </div>
  <div v-else class="haku">
    <div class="search">
      <ep-search v-model="query" :sr-placeholder="$t('etsi-koulutuksen-jarjestajia')"/>
    </div>
    <div class="content">

      <ep-ammatillinen-row v-for="(koulutustoimija, index) in koulutustoimijatPaged" :key="'koulutuksenjarjestaja' + index"
        :route="{name:'ammatillinenKoulutuksenjarjestaja', params: {koulutuksenjarjestajaId: koulutustoimija.id}}">
        <div :class="{'pt-2 pb-2': !koulutustoimija.kuvaus}">
          <span class="nimi">{{ $kaanna(koulutustoimija.nimi) }}</span>
          <span class="kuvaus" v-html="$kaanna(koulutustoimija.kuvaus)"></span>
        </div>
      </ep-ammatillinen-row>

      <div class="pagination d-flex justify-content-center">
        <EpBPagination v-model="page"
                       :items-per-page="perPage"
                       :total="total"
                       aria-controls="koulutuksenjarjestajat-lista">
        </EpBPagination>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { KoulutuksenJarjestajatStore } from '@/stores/KoulutuksenJarjestajatStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';

@Component({
  components: {
    EpBPagination,
    EpSpinner,
    EpSearch,
    EpExternalLink,
    EpAmmatillinenRow,
  },
})
export default class RouteAmmatillinenKoulutuksenJarjestajat extends Vue {
  @Prop({ required: true })
  koulutuksenJarjestajatStore!: KoulutuksenJarjestajatStore;

  private query = '';
  private page = 1;
  private perPage = 10;

  mounted() {
    this.koulutuksenJarjestajatStore.fetch();
  }

  get koulutustoimijat() {
    if (this.koulutuksenJarjestajatStore.koulutustoimijat.value) {
      return _.chain(this.koulutuksenJarjestajatStore.koulutustoimijat.value)
        .filter(koulutustoimija => Kielet.search(this.query, koulutustoimija.nimi))
        .value();
    }
  }

  get koulutustoimijatPaged() {
    if (this.koulutustoimijat) {
      return _.chain(this.koulutustoimijat)
        .drop(this.perPage * (this.page - 1))
        .take(this.perPage)
        .value();
    }
  }

  get total() {
    return _.size(this.koulutustoimijat);
  }

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.kuvaus {
  font-size: small;
  color: #555;
}

.content {
  margin-top: 20px;

  .nimi {
    font-weight: 600;
  }

  .kuvaus {
    font-size: 0.8rem;
  }
}

.pagination {
  margin-top: 10px;
}
</style>

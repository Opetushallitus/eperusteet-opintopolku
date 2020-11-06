<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-tyopajat') }}</p>

  <div class="search mb-4">
    <ep-search v-model="query" :placeholder="$t('etsi')"/>
  </div>
  <ep-spinner v-if="!opetussuunnitelmat" />
  <div v-else-if="opetussuunnitelmat.length === 0">
    <div class="alert alert-info">
      {{ $t('ei-toteutettuja-tyopajoja') }}
    </div>
  </div>
  <div v-else-if="opetussuunnitelmatFiltered.length === 0">
    <div class="alert alert-info">
      {{ $t('ei-hakutuloksia') }}
    </div>
  </div>
  <div v-else id="opetussuunnitelmat-lista">
    <div v-for="(ops, idx) in opetussuunnitelmatPaginated" :key="idx">

      <router-link :to="ops.route">
        <opetussuunnitelma-tile :ops="ops" :query="query">
          <div slot="icon">
            <fas icon="osaamisen-arviointi" class="icon"/>
          </div>
        </opetussuunnitelma-tile>
      </router-link>

    </div>
    <b-pagination v-model="page"
                  class="mt-4"
                  :total-rows="opetussuunnitelmatFiltered.length"
                  :per-page="perPage"
                  align="center"
                  aria-controls="opetussuunnitelmat-lista"
                  :first-text="$t('alkuun')"
                  prev-text="«"
                  next-text="»"
                  :last-text="$t('loppuun')" />
  </div>

</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TyopajatStore } from '@/stores/TyopajatStore';
import OpetussuunnitelmaTile from '../kooste/OpetussuunnitelmaTile.vue';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';
import { OpetussuunnitelmaDto } from '@shared/api/amosaa';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';

@Component({
  components: {
    OpetussuunnitelmaTile,
    EpSpinner,
    EpSearch,
  },
})
export default class RouteAmmatillinenTyopajat extends Vue {
  private tyopajatStore = new TyopajatStore();
  private query = '';
  private page = 1;
  private perPage = 10;

  async mounted() {
    await this.tyopajatStore.fetch();
  }

  get opetussuunnitelmat(): any {
    if (this.tyopajatStore.opetussuunnitelmat.value) {
      return _.map(this.tyopajatStore.opetussuunnitelmat.value, (opetussuunnitelma: OpetussuunnitelmaDto) => (
        {
          ...opetussuunnitelma,
          route: {
            name: 'toteutussuunnitelma',
            params: {
              toteutussuunnitelmaId: _.toString(opetussuunnitelma.id),
              koulutustyyppi: 'ammatillinen',
            },
          },
        }
      ));
    }

    return undefined;
  }

  get opetussuunnitelmatFiltered() {
    return _.chain(this.opetussuunnitelmat)
      .filter(ops => Kielet.search(this.query, ops.nimi))
      .value();
  }

  get opetussuunnitelmatPaginated() {
    return _.chain(this.opetussuunnitelmatFiltered)
      .drop(this.perPage * (this.page - 1))
      .take(this.perPage)
      .value();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.kuvaus {
  font-size: small;
  color: #555;
}

.icon {
  height: 40px;
  width: 40px;
  color: $green-lighten-2;
}
</style>

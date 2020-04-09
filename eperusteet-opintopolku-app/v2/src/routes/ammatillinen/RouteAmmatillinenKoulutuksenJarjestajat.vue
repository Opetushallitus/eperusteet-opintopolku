<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-jarjestajat') }}</p>

  <div v-if="!koulutustoimijat">
    <ep-spinner />
  </div>
  <div v-else class="haku">
    <div class="search">
      <ep-search v-model="query" />
    </div>
    <div class="content">
      <div class="d-flex koulutuksenjarjestaja tile-background-shadow-selected shadow-tile" v-for="(koulutustoimija, index) in koulutustoimijatPaged" :key="'koulutuksenjarjestaja' + index">
        <ep-external-link :url="koulutustoimija.ulkoinenlinkki" :showIcon="false">
          <div class="kjcard">
            <fas icon="ulkoinen-linkki" /> {{ $kaanna(koulutustoimija.nimi) }}
          </div>
        </ep-external-link>
      </div>

      <div class="pagination d-flex justify-content-center">
        <b-pagination v-model="page"
                      :total-rows="total"
                      :per-page="perPage"
                      align="center"
                      aria-controls="koulutuksenjarjestajat-lista"
                      :first-text="$t('alkuun')"
                      prev-text="«"
                      next-text="»"
                      :last-text="$t('loppuun')" />
      </div>
    </div>

  </div>

</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import PerusteHaku from './PerusteHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import { KoulutuksenJarjestajatStore } from '@/stores/KoulutuksenJarjestajatStore';
import { KoulutustoimijaJulkinenDto } from '@shared/api/amosaa';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import * as _ from 'lodash';
import { ENV_PREFIX } from '@shared/utils/defaults';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    PerusteHaku,
    EpSpinner,
    EpSearch,
    EpExternalLink,
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
        .map(koulutustoimija => {
          return {
            ...koulutustoimija,
            ulkoinenlinkki: this.ulkoinenlinkki(koulutustoimija),
          };
        })
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

  ulkoinenlinkki(kj) {
    return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/selaus/jarjestajat/${kj.id}`;
  }

  get total() {
    return _.size(this.koulutustoimijat);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.kuvaus {
  font-size: small;
  color: #555;
}

.content {
  margin-top: 20px;

  .koulutuksenjarjestaja {
    margin: 5px;

    .linkki {
      width: 100%;
      border-left: 6px solid rgb(0, 136, 0);
    }

    .kjcard {
      width: 100%;
      border: 1px solid rgb(232, 232, 233);
      padding: 15px;
      font-size: normal;
      font-weight: bolder;
    }
  }
}

.pagination {
  margin-top: 10px;
}
</style>

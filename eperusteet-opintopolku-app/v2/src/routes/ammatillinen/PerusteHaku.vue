<template>
<div v-if="!perusteet">
  <ep-spinner />
</div>
<div v-else class="haku">
  <div class="search">
    <ep-search v-model="query" />
    <div class="checkboxes d-flex align-self-center flex-wrap">
      <ep-toggle v-for="(toggle, idx) in toggles"
                 :key="idx"
                 v-model="filters[toggle]" :isSWitch="false">
        {{ $t('switch-' + toggle) }}
      </ep-toggle>
    </div>
  </div>
  <div class="content">
    <div class="perusteet" id="perusteet-lista">
      <div class="d-flex peruste" v-for="(peruste, idx) in perusteet" :key="idx">
        <div class="colorbox"></div>
        <div class="perustecard">
          <div class="nimi">
            <ep-external-link :url="peruste.ulkoinenlinkki">{{ $kaanna(peruste.nimi) }}</ep-external-link>
          </div>
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
            {{ $ld(peruste.voimassaoloAlkaa) }}
          </div>
        </div>
      </div>
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import _ from 'lodash';
import { ENV_PREFIX } from '@shared/utils/defaults';

@Component({
  components: {
    EpToggle,
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
  },
})
export default class PerusteHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: PerusteHakuStore;

  @Prop({ type: String })
  private tyyppi!: string;

  mounted() {
    this.perusteHakuStore.fetch();
  }

  get toggles() {
    return this.perusteHakuStore.toggles;
  }

  get perusteet() {
    return _.chain(this.perusteHakuStore.perusteet)
      .map(peruste => ({
        ...peruste,
        ulkoinenlinkki: this.ulkoinenlinkki(peruste)
      }))
      .value();
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
    this.perusteHakuStore.updateFilters({ [toggle]: !this.filters[toggle] });
  }

  ulkoinenlinkki(peruste) {
    return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/${this.tyyppi}/${peruste.id}`;
  }

}
</script>

<style scoped lang="scss">

.haku {
  width: 100%;

  .checkboxes {
    padding: 10px;
    .custom-switch {
      margin: 5px 15px 0 0;
    }
  }

  .perusteet {
    margin-top: 20px;

    .peruste {
      border-radius: 0;
      padding: 5px;

      .colorbox {
        top: 0;
        right: 0;
        position: relative;
        width: 1px;
        border-left: 6px solid rgb(0, 136, 0);
      }

      .perustecard {
        width: 100%;
        border: 1px solid rgb(232, 232, 233);
        padding: 10px;

        .nimi {
          font-size: normal;
          font-weight: bolder;
          margin-bottom: 8px;
        }
        .nimikkeet {
          font-size: small;
          color: #666;

          .kohde {
            font-weight: bolder;
          }
        }
        .voimaantulo {
          font-size: smaller;
          color: #666;
        }
      }
    }
  }

  .pagination {
    margin-top: 10px;
  }
}

</style>

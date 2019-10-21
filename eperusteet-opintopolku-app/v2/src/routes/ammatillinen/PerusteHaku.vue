<template>
<div v-if="!perusteet">
  <ep-spinner />
</div>
<div v-else class="haku">
  <div class="search">
    <ep-search v-model="query" />
    <div class="checkboxes d-flex align-self-center flex-wrap">
      <b-form-checkbox
        v-for="(toggle, idx) in toggles"
        :key="idx"
        v-model="filters[toggle]"
        @change="onToggleChange(toggle)"
        switch>
        {{ $t('switch-' + toggle) }}
      </b-form-checkbox>
    </div>
  </div>
  <div class="content">
    <div class="perusteet">
      <div class="d-flex peruste" v-for="(peruste, idx) in perusteet" :key="idx">
        <div class="colorbox"></div>
        <div class="perustecard">
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
          <div class="voimaantulo">
            {{ $ld(peruste.voimassaoloAlkaa) }}
          </div>
        </div>
      </div>
    </div>
    <div class="pagination d-flex justify-content-center">
      <b-pagination
        class=""
        v-if="total >= perPage"
        v-model="page"
        :total-rows="total"
        :per-page="perPage"
        :first-text="$t('alkuun')"
        prev-text="«"
        next-text="»"
        :last-text="$t('loppuun')" />
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import _ from 'lodash';


@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
  },
})
export default class PerusteHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: PerusteHakuStore;

  mounted() {
    this.perusteHakuStore.fetch();
  }

  get toggles() {
    return [
      'tuleva',
      'voimassaolo',
      'siirtyma',
      'poistunut',
      'tutkintonimikkeet',
      'tutkinnonosat',
      'osaamisalat',
    ];
  }

  get perusteet() {
    return this.perusteHakuStore.perusteet; 
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

}
</script>

<style scoped lang="scss">

.haku {
  width: 100%;

  .checkboxes {
    padding: 10px;
    .custom-switch {
      margin: 5px 15px 0px 0;
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

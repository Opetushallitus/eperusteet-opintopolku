<template>
<div>
  <div>
    <ep-header :murupolku="murupolku">
      <template slot="header">
        {{ $t('ajankohtaista') }}
      </template>
      <div class="search">
        <ep-search :value="query" @input="setValue" />
      </div>
      <div v-if="tiedotteet.tiedotteet">
        <div v-if="!isTiedotteetEmpty">
          <div class="tiedotteet" id="tiedotteet-lista">
            <div class="tiedote" v-for="(tiedote, idx) in tiedotteet.tiedotteet" :key="idx">
              <div class="otsikko">
                <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
                  {{ $kaanna(tiedote.otsikko) }}
                </router-link>
              </div>
              <div class="aikaleima">
                {{ $sd(tiedote.luotu) }}
              </div>
              <div class="tiedote-sisalto">
                <ep-content-viewer :value="$kaanna(tiedote.sisalto)"/>
              </div>
            </div>
          </div>
          <b-pagination :value="page"
                        @change="updatePage"
                        :total-rows="tiedotteet.amount"
                        :per-page="tiedotteet.filter.sivukoko"
                        align="center"
                        aria-controls="tiedotteet-lista"
                        :first-text="$t('alkuun')"
                        prev-text="«"
                        next-text="»"
                        :last-text="$t('loppuun')" />
        </div>
      <div v-else>{{ $t('ei-hakutuloksia') }}</div>
      </div>
      <ep-spinner v-else />
    </ep-header>
  </div>
</div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { Kielet } from '@shared/stores/kieli';
import { Meta } from '@shared/utils/decorators';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpSearch,
    EpContentViewer,
  },
})
export default class RouteUutiset extends Vue {
  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;
  private page = 1;
  private query = '';

  public mounted() {
    this.tiedoteStore.fetchUutiset();
  }

  get tiedotteet() {
    return {
      tiedotteet: this.tiedoteStore.tiedotteet,
      filter: this.tiedoteStore.filter,
      amount: this.tiedoteStore.amount,
    };
  }

  get isTiedotteetEmpty() {
    return this.tiedotteet.amount === 0;
  }

  private updatePage(value) {
    this.page = value;
    this.tiedoteStore.updateFilter({
      sivu: value - 1,
    });
  }

  private setValue(value) {
    this.page = 1;
    this.tiedoteStore.updateFilter({
      nimi: value,
      sivu: 0,
    });
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get murupolku() {
    return [{
      label: 'ajankohtaista',
      location: {
        name: 'uutiset',
      },
    }];
  }

  @Meta
  getMetaInfo() {
    return {
      title: (this as any).$t('ajankohtaista'),
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.search {
  margin-bottom: 40px;
  padding: 0 15px;
}

.tiedotteet {
  padding: 15px;

  .tiedote {
    margin-bottom: 50px;

    .otsikko {
      color: #001A58;
      font-size: 1.5rem;
    }

    .aikaleima {
      color: #555;
      font-weight: lighter;
    }

    .tiedote-sisalto {
      margin-top: 10px;
    }
  }
}

</style>

<template>
<div>
  <div>
    <ep-header :murupolku="[]">
      <template slot="header">
        {{ $t('uutiset') }}
      </template>
      <div class="search">
        <ep-search :value="query" @input="setValue" />
      </div>
      <div v-if="tiedotteet.tiedotteet">
        <div v-if="!isTiedotteetEmpty">
          <div class="tiedotteet">
            <div class="tiedote" v-for="(tiedote, idx) in tiedotteet.tiedotteet" :key="idx">
              <div class="otsikko">
                {{ $kaanna(tiedote.otsikko) }}
              </div>
              <div class="aikaleima">
                {{ $sd(tiedote.luotu) }}
              </div>
              <div class="tiedote-sisalto">
                <p v-html="$kaanna(tiedote.sisalto)"></p>
              </div>
            </div>
          </div>
          <b-pagination :value="page"
                        @change="updatePage"
                        :total-rows="tiedotteet.amount"
                        :per-page="tiedotteet.filter.sivukoko"
                        align="center"
                        aria-controls="uutiset-sivut"></b-pagination>
        </div>
      <div v-else>{{ $t('ei-hakutuloksia') }}</div>
      </div>
      <ep-spinner v-else />
    </ep-header>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import { Tiedotteet } from '@shared/api/eperusteet';
import { TiedoteStore } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpSearch,
  },
})
export default class RouteUutiset extends Vue {
  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;
  private page = 1;
  private query = '';

  public mounted() {
    this.tiedoteStore.getUutiset();
  }

  get tiedotteet() {
    return this.tiedoteStore.data();
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
    return Kielet.getSisaltoKieli();
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.search {
  margin-bottom: 40px;
padding: 15px;
}
.tiedotteet {
  padding: 15px;

  .tiedote {
    margin-bottom: 50px;

    .otsikko {
      color: #001A58;
      font-size: 22px;
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


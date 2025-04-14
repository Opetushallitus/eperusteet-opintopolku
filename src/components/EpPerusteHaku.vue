<template>
  <div class="haku">
    <EpButton
      link
      class="mb-2"
      no-padding
      @click="$emit('clear')"
    >
      <span class="font-weight-bold">&#60;</span> {{ $t('takaisin-edelliseen-nakymaan') }}
    </EpButton>

    <EpHakutulosmaara
      class="tulos font-weight-600 mt-2"
      :kokonaismaara="kokonaismaara"
    />

    <ep-spinner v-if="!tulokset" />
    <div
      v-else-if="tulokset.length === 0"
      class="alert alert-info"
    >
      {{ $t('ei-hakutuloksia') }}
    </div>

    <template v-else>
      <div class="tulokset mt-4">
        <div
          v-for="(tulos,index) in tuloksetSorted"
          :key="'tulos' + index"
          class="tulos"
        >
          <div class="osantyyppi">
            {{ $t(tulos.target.perusteenOsa.osanTyyppi) }}
          </div>
          <div class="nimi">
            <div v-if="!tulos.location || !tulos.location.name">
              {{ $kaanna(tulos.target.perusteenOsa.nimi) }}
            </div>
            <slot
              v-else
              name="nimi"
              :tulos="tulos"
            >
              <router-link
                :to="tulos.location"
                @click.native="clear"
              >
                {{ tulos.nimi }}
              </router-link>
            </slot>
          </div>
          <div
            v-if="tulos.type === 'sisalto'"
            class="osuma"
            v-html="tulos.result[0]"
          />
        </div>

        <EpBPagination
          v-model="sivu"
          :items-per-page="sivukoko"
          :total="tulokset.length"
          aria-controls="sisaltohakutulos-lista"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { deepFind, typeSort } from '@/utils/sisaltohaku';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';

@Component({
  components: {
    EpSearch,
    EpSpinner,
    EpBPagination,
    EpHakutulosmaara,
  },
  watch: {
    query: {
      handler: 'queryImplDebounce',
      immediate: true,
    },
  },
})
export default class EpPerusteHaku extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private query!: string;

  private queryImplDebounce = _.debounce(this.queryImpl, 300);
  private tulokset: any[] | null = null;
  private sivu = 1;
  private sivukoko = 10;

  async queryImpl(query) {
    if (query.length > 2) {
      this.tulokset = null;
      const julkaisu = await this.perusteDataStore.peruste;
      const result: any[] = [];
      deepFind(julkaisu, [], result, _.toLower(query));
      this.tulokset = result;
    }
  }

  clear() {
    this.query = '';
  }

  get tuloksetSorted() {
    return _.chain(this.tulokset)
      .map(tulos => {
        var numerointi = _.find(this.perusteDataStore.flattenedSidenav, { location: tulos.location })?.meta?.numerointi;
        return {
          ...tulos,
          numerointi,
          nimi: (numerointi || '') + ' '
                + (this.$kaanna(tulos.target.perusteenOsa.nimi) || this.$t(tulos.osanTyyppi))
                + (tulos.target.perusteenOsa?.meta?.nimi ? ', ' + this.$t(tulos.target.perusteenOsa.meta?.nimi) : ''),
        };
      })
      .sortBy(tulos => tulos.target.perusteenOsa?.meta?.nimi || 99)
      .sortBy(tulos => typeSort[tulos.type])
      .slice((this.sivu - 1) * this.sivukoko, this.sivu * this.sivukoko)
      .value();
  }

  get kokonaismaara() {
    return this.tulokset?.length;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.haku {
  padding: $sidenav-padding;

  .tulokset {
    .tulos {
      margin-bottom: 16px;

      .osantyyppi {
        font-weight: lighter;
      }

      .nimi {
        font-weight: bolder;
      }

    }
  }

}

</style>

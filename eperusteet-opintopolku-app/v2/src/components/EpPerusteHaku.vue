<template>
  <div class="haku">
    <h2>{{ $t('haku') }}: {{ query }}</h2>
    <ep-spinner v-if="isLoading" />
    <div v-else class="tulokset">
      <div class="tulos" v-for="tulos in tulokset" :key="JSON.stringify(tulos.location)">
        <div class="osantyyppi">
          {{ $t(tulos.target.perusteenOsa.osanTyyppi) }}
        </div>
        <div class="nimi">
          <router-link :to="tulos.location" @click="clear">
            {{ $kaanna(tulos.target.perusteenOsa.nimi) }}
          </router-link>
        </div>
        <div class="osuma" v-html="tulos.result[0]"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { osaToLocation } from '@shared/utils/NavigationBuilder';
// import EpSidenavNode from '@/components/EpSidenav/EpSidenavNode.vue';

interface Tulos {
  [key: string]: Tulos | any;
  osanTyyppi?: string;
};

type Haettava = Tulos[] | Tulos;

const MatchFields = [
  'fi',
  'sv',
  'en',
];

function queryMatch(target, query: string) {
  return _.includes(_.toLower(target), query);
}

const clearEl = document.createElement('div');

function applyLocationTag(target: string, query: string) {
  clearEl.innerHTML = target;
  const idx = _.toLower(clearEl.innerText).indexOf(_.toLower(query));
  const contextAmount = 100;
  const start = idx - contextAmount;
  const size = _.size(query) + contextAmount * 2;
  const text
    = (start > 0 ? '...' : '')
    + clearEl.innerText.substr(start, size)
    + (size < clearEl.innerText.length - 1 ? '...' : '');
  return _.replace(text, query, `<mark>${query}</mark>`);
}

function deepFind(target: Haettava, path: any[], results: any[], query: string): any[] {
  let result = [] as any[];
  if (_.isArray(target)) {
    for (const next of target) {
      result = [...result, ...deepFind(next, path, results, query)];
    }
  }
  else if (_.isObject(target)) {
    for (const key of _.keys(target)) {
      const next = target[key];
      if (_.isString(next) && _.includes(MatchFields, key) && queryMatch(next, query)) {
        result = [...result, applyLocationTag(next, query)];
      }
      else {
        const nested = deepFind(
          target[key],
          [...path, target],
          results,
          query);
        result = [...result, ...nested];
      }
    }

    const osanTyyppi = _.get(target, 'perusteenOsa.osanTyyppi');
    if (osanTyyppi && !_.isEmpty(result)) {
      results.push({
        path,
        osanTyyppi,
        target,
        result,
        location: osaToLocation(target as any),
      });
      return [];
    }
  }
  return result;
}

@Component({
  components: {
    EpSearch,
    EpSpinner,
    // EpSidenavNode,
  },
  watch: {
    query: {
      handler: 'queryImplDebounce',
      immediate: false,
    },
  },
})
export default class EpPerusteHaku extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private query!: string;

  private isLoading = true;

  private queryImplDebounce = _.debounce(this.queryImpl, 300);

  private tulokset = [] as any[];

  async queryImpl(query) {
    this.isLoading = true;
    this.$router.replace({
      query: {
        query,
      },
    });

    try {
      const julkaisu = await this.perusteDataStore.fetchJulkaisu();
      const result: any[] = [];
      deepFind(julkaisu, [], result, _.toLower(query));
      this.tulokset = result;
    }
    finally {
      this.isLoading = false;
    }
  }

  clear() {
    this.query = '';
    this.isLoading = false;
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
        a {
          font-weight: bolder;
        }
      }

      .osuma {
      }
    }
  }

}

</style>

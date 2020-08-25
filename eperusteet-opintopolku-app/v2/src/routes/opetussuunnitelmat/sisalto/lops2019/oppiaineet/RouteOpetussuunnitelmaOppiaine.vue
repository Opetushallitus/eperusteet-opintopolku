<template>
<div class="content">
  <div v-if="oppiaine">
    <h2 class="otsikko" slot="header">{{ $kaanna(oppiaine.nimi) }}</h2>

    <div class="teksti">
      <oppiaine-esitys :oppiaine="oppiaine"
                       :termit="perusteTermit"
                       :kuvat="perusteKuvat"
                       :is-peruste-view="false"
                       :nav-oppimaarat="oppimaarat" />

      <div v-if="hasOpintojaksot">
        <h3 id="opintojaksot">{{ $t('opintojaksot') }}</h3>
        <div v-for="(opintojakso, idx) in opintojaksotExtended" :key="idx">
          <router-link v-if="opintojakso.location" :to="opintojakso.location">
            {{ $kaanna(opintojakso.nimi) }}
            <span v-if="opintojakso.koodiLabel" class="code-field">({{ opintojakso.koodiLabel }})</span>
          </router-link>
        </div>
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import OppiaineEsitys from '@/routes/perusteet/sisalto/lops2019/oppiaineet/OppiaineEsitys.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpetussuunnitelmaOppiaineStore } from '@/stores/Lops2019OpetussuunnitelmaOppiaineStore';
import { NavigationNode } from '@shared/utils/NavigationBuilder';

@Component({
  components: {
    EpSpinner,
    EpColorIndicator,
    EpContentViewer,
    OppiaineEsitys,
  },
})
export default class RouteOpetussuunnitelmaOppiaine extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private lops2019OpetussuunnitelmaOppiaineStore!: Lops2019OpetussuunnitelmaOppiaineStore;

  get perusteTermit() {
    return this.opetussuunnitelmaDataStore.perusteTermit;
  }

  get perusteKuvat() {
    return this.opetussuunnitelmaDataStore.perusteKuvat;
  }

  get oppiaine() {
    return this.lops2019OpetussuunnitelmaOppiaineStore.oppiaine;
  }

  get opintojaksot() {
    if (this.oppiaine && this.oppiaine.koodi) {
      return _.filter(this.opetussuunnitelmaDataStore.opintojaksot, oj => {
        const uri = this.oppiaine!.koodi!.uri;
        return _.some(oj.oppiaineet, { koodi: uri });
      });
    }
  }

  get opintojaksotExtended() {
    if (this.opintojaksot) {
      return _.map(this.opintojaksot, oj => {
        return {
          ...oj,
          location: {
            name: 'lops2019OpetussuunnitelmaOpintojakso',
            params: { opintojaksoId: _.toString(oj.id) },
          },
          koodiLabel: _.get(oj, 'koodi'),
        };
      });
    }
  }

  get hasOpintojaksot() {
    return !_.isEmpty(this.opintojaksot);
  }

  get oppimaarat() {
    function traverseTree(node, result) {
      (node.children || [])
        .map(child => {
          result.push(child);
          traverseTree(child, result);
          return child;
        });
    }

    if (this.opetussuunnitelmaDataStore.current) {
      const result: NavigationNode[] = [];
      traverseTree(this.opetussuunnitelmaDataStore.current, result);
      _.filter(result, node => node.type === 'oppiaine');
      return _.filter(result, node => node.type === 'oppiaine');
    }
    else {
      return [];
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
}
</style>

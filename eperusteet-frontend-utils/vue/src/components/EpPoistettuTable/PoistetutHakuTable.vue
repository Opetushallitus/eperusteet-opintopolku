<template>
  <div>
    <ep-search v-model="query" class="mb-4" />
    <poistetut-table :poistetut="rajatut" @palauta="palauta" />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Kielet } from '@shared/stores/kieli';
import PoistetutTable from './PoistetutTable.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';

export interface Poistettu {
    id?: number;
    tyyppi?: any;
    nimi?: { [key: string]: string; };
    luoja?: string;
    luotu?: Date;
    muokkaaja?: string;
    muokattu?: Date;
}

@Component({
  components: {
    EpSearch,
    PoistetutTable,
  },
})
export default class PoistetutHakuTable extends Vue {
  @Prop({
    required: true,
  })
  private poistetut!: Poistettu[];

  private query = '';

  get rajatut() {
    const hakutermi = _.toLower(this.query);
    const kieli = Kielet.getSisaltoKieli.value;

    return _.chain(this.poistetut)
      .filter(p => _.includes(_.toLower(_.get(p, 'nimi.' + kieli)), hakutermi))
      .sortBy('muokattu')
      .reverse()
      .value();
  }

  palauta(poistettu) {
    this.$emit('palauta', poistettu);
  }
}

</script>

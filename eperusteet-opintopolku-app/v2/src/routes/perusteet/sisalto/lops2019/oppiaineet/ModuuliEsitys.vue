<template>
<div>
  <div v-if="hasKuvaus">
    <ep-content-viewer v-if="moduuli.kuvaus"
                       :value="$kaanna(moduuli.kuvaus)"
                       :termit="termit"
                       :kuvat="kuvat" />
  </div>

  <!-- Halutaanko esittää tässä myös?
  <div v-if="koodi">
    <strong>{{ $t('koodi') }}</strong>
    <p>{{ koodi.arvo }}</p>
  </div>

  <div v-if="tyyppi">
    <strong>{{ $t('tyyppi') }}</strong>
    <p>{{ $t(tyyppi) }}</p>
  </div>

  <div v-if="moduuli.laajuus">
    <strong>{{ $t('laajuus') }}</strong>
    <p>{{ moduuli.laajuus }}</p>
  </div>
  -->

  <div v-if="hasTavoitteet">
    <h3>{{ $t('yleiset-tavoitteet') }}</h3>
    <div v-if="tavoitteet.kohde">{{ $kaanna(tavoitteet.kohde) }}</div>
    <ul>
      <li v-for="(tavoite, idx) in tavoitteet.tavoitteet" :key="idx">{{ $kaanna(tavoite) }}</li>
    </ul>
  </div>

  <div v-if="hasSisallot">
    <h3>{{ $t('keskeiset-sisallot') }}</h3>
    <div v-for="(sisalto, idx) in sisallot" :key="idx">
      <div v-if="sisalto.kohde">{{ $kaanna(sisalto.kohde) }}</div>
      <ul>
        <li v-for="(osa, idx) in sisalto.sisallot" :key="idx">{{ $kaanna(osa) }}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Lops2019ModuuliDto, TermiDto } from '@shared/api/ylops';
import { LiiteDtoWrapper } from '@shared/tyypit';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpColorIndicator,
    EpContentViewer,
  },
})
export default class ModuuliEsitys extends Vue {
  @Prop({ required: false, default: true })
  private isPerusteView!: boolean;

  @Prop({ required: true })
  private moduuli!: Lops2019ModuuliDto;

  @Prop({ required: false, type: Array })
  private termit!: TermiDto[];

  @Prop({ required: false, type: Array })
  private kuvat!: LiiteDtoWrapper[];

  get koodi() {
    return this.moduuli.koodi;
  }

  get hasKuvaus() {
    if (this.moduuli) {
      return this.moduuli.kuvaus;
    }
  }

  get tyyppi() {
    if (this.moduuli) {
      return this.moduuli.pakollinen ? 'pakollinen' : 'valinnainen';
    }
  }

  get tavoitteet() {
    if (this.moduuli) {
      return this.moduuli.tavoitteet;
    }
  }

  get hasTavoitteet() {
    return !_.isEmpty(this.tavoitteet);
  }

  get sisallot() {
    if (this.moduuli) {
      return this.moduuli.sisallot;
    }
  }

  get hasSisallot() {
    return !_.isEmpty(this.sisallot);
  }
}
</script>

<style scoped lang="scss">
</style>

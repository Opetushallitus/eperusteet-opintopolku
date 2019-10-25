<template>
<div class="content">
    <h2 class="otsikko" slot="header">{{ $kaanna(moduuli.nimi)}}</h2>

    <div class="teksti">
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

        <div v-if="hasTavoitteet">
            <h3>{{ $t('tavoitteet') }}</h3>
            <p v-if="tavoitteet.kohde">{{ $kaanna(tavoitteet.kohde) }}</p>
            <ul>
                <li v-for="(tavoite, idx) in tavoitteet.tavoitteet" :key="idx">{{ $kaanna(tavoite) }}</li>
            </ul>
        </div>

        <div v-if="hasSisallot">
            <h3>{{ $t('sisallot') }}</h3>
            <div v-for="(sisalto, idx) in sisallot"
                 :key="idx">
                <p v-if="sisallot.kohde">{{ $kaanna(sisalto.kohde) }}</p>
                <ul>
                    <li v-for="(osa, idx) in sisalto.sisallot" :key="idx">{{ $kaanna(osa) }}</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019ModuuliStore } from '@/stores/Lops2019ModuuliStore';

@Component({})
export default class RouteModuuli extends Vue {
  @Prop({ required: true })
  private lops2019moduuliStore!: Lops2019ModuuliStore;

  get moduuli() {
    return this.lops2019moduuliStore.moduuli;
  }

  get koodi() {
    if (this.moduuli) {
      return this.moduuli.koodi;
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
@import '../../../../../styles/_variables.scss';
@import '../../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>

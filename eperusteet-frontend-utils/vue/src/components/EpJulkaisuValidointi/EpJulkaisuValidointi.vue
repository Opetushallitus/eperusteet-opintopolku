<template>
  <div>
    <template v-if="virheita">
      <VirheHuomautukset :virhehuomautukset="validointi.virheet" tyyppi="virhe"/>
    </template>

    <template v-if="huomautuksia">
      <EpToggle v-model="naytaHuomautukset" class="mt-4">
        {{$t('nayta-huomautukset')}}
      </EpToggle>

      <template v-if="naytaHuomautukset">
        <div class="font-weight-bold mt-4 mb-3">{{$t('huomautukset')}}</div>
        <VirheHuomautukset :virhehuomautukset="validointi.huomautukset" tyyppi="huomautus"/>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import VirheHuomautukset from './VirheHuomautukset.vue';
import { NavigationNodeDto } from '@shared/tyypit';

export interface VirheHuomautus {
  kuvaus: string;
  nimi: { [key: string]: string; };
  route: any;
  navigationNode: NavigationNodeDto;
}

interface Validointi {
  kategoria: string;
  virheet: VirheHuomautus[];
  huomautukset: VirheHuomautus[];
}

@Component({
  components: {
    EpToggle,
    VirheHuomautukset,
  },
})
export default class EpJulkaisuValidointi extends Vue {
  @Prop({ required: true })
  private validointi!: Validointi;

  private naytaHuomautukset: boolean = false;

  get virheita() {
    return !_.isEmpty(this.validointi.virheet);
  }

  get huomautuksia() {
    return !_.isEmpty(this.validointi.huomautukset);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

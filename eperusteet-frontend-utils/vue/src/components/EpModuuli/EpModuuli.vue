<template>
    <div class="moduuli d-flex flex-column align-items-end px-2 py-3 m-2">
      <div class="font-weight-bold">{{$kaanna(moduuli.nimi)}} <span v-if="moduuli.koodi">({{moduuli.koodi.arvo}})</span></div>
      <div class="d-flex justify-content-end mt-auto">
        <div class="mr-1 opintopiste" v-if="moduuli.laajuus">{{moduuli.laajuus}} {{$t('opintopiste')}}</div>
        <EpColorIndicator class="mt-1" :kind="moduuli.pakollinen ? 'pakollinen' : 'valinnainen'"/>
      </div>
    </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { LokalisoituTekstiDto } from '@shared/tyypit';
import { KoodiDto } from '@shared/api/eperusteet';

interface Moduuli {
    nimi: { [key: string]: string; };
    pakollinen: boolean;
    koodi?: KoodiDto;
    laajuus?: number;
}

@Component({
  components: {
    EpColorIndicator,
  },
})
export default class EpModuuli extends Vue {
  @Prop({ required: true })
  moduuli!: Moduuli;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
  .moduuli {
    width:160px;
    height:160px;
    background-color: #eaf6fe;
    border-radius: 0.5em;
    color: $blue-darken-1;

    .opintopiste {
      font-size: 0.85rem;
    }
  }
</style>

<template>
  <span v-if="voimassa" class="ml-2">
    <EpColorIndicator :size="10" background-color="#4c7f00" :tooltip="false" kind=""/>
    {{ $t('voimassa') }}
  </span>
  <span v-else-if="tulossa" class="ml-2">
    <EpColorIndicator :size="10" background-color="#5BCA13" :tooltip="false" kind=""/>
    {{ $t('tulossa-voimaan') }}
  </span>
  <span v-else-if="siirtymaAjalla" class="ml-2">
    <EpColorIndicator :size="10" background-color="#F5B800" :tooltip="false" kind=""/>
    {{ $t('ajoitus-siirtyma') }}
  </span>
  <span v-else-if="eraantynyt" class="ml-2">
    <EpColorIndicator :size="10" background-color="#FF5000" :tooltip="false" kind=""/>
    {{ $t('ei-voimassa') }}
  </span>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';

interface Voimassaolo {
  voimaantulo?: number;
  voimassaoloAlkaa?: number;
  voimassaoloLoppuu?: number;
  siirtymaPaattyy?: number;
}

@Component({
  components: {
    EpColorIndicator,
  },
})
export default class EpVoimassaolo extends Vue {
  @Prop({ required: true })
  private voimassaolo!: Voimassaolo;

  get voimassaolonAlku() {
    return this.voimassaolo.voimaantulo || this.voimassaolo.voimassaoloAlkaa;
  }

  get eraantynyt() {
    return this.voimassaolo.voimassaoloLoppuu && Date.now() > this.voimassaolo.voimassaoloLoppuu;
  }

  get voimassa() {
    return this.voimassaolonAlku && this.voimassaolonAlku < Date.now() && (!this.voimassaolo.voimassaoloLoppuu || Date.now() < this.voimassaolo.voimassaoloLoppuu);
  }

  get tulossa() {
    return this.voimassaolonAlku && this.voimassaolonAlku > Date.now();
  }

  get siirtymaAjalla() {
    return this.voimassaolo.siirtymaPaattyy && Date.now() < this.voimassaolo.siirtymaPaattyy;
  }
}
</script>

<style scoped lang="scss">

</style>

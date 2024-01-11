<template>
<div>
  <div v-if="showPerustesisalto">
    <div class="perustesisalto" v-for="(oppiaine, idx) in opintojaksonOppiaineidenTiedot" :key="idx+'op-arviointi'">
      <div v-if="oppiaine.arviointi && oppiaine.arviointi.kuvaus">
        <div class="moduuliotsikko"><h4 v-html="$kaanna(oppiaine.nimi)">></h4></div>
        <ep-content layout="normal" :opetussuunnitelma-store="opetussuunnitelmaStore" :value="oppiaine.arviointi.kuvaus"></ep-content>
      </div>
    </div>
    <div v-if="showEmptyAlert || value.arviointi">
      <div class="moduuliotsikko"><h4>{{ $t('paikallinen-lisays-opintojakso-arviointi') }}</h4></div>
      <div class="alert alert-info" v-if="!isEditing && !value.arviointi">{{ $t('ei-paikallista-tarkennusta') }}</div>
    </div>
  </div>
  <ep-content :opetussuunnitelma-store="opetussuunnitelmaStore" layout="normal" v-model="value.arviointi" :is-editable="isEditing"></ep-content>

  <div v-for="(paikallinenOpintojakso, index) in value.paikallisetOpintojaksot" :key="index+'paik-arviointi'" class="mt-4">
    <div v-if="paikallinenOpintojakso.arviointi">
      <div class="moduuliotsikko"><h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4></div>
      <ep-content :opetussuunnitelma-store="opetussuunnitelmaStore" layout="normal" v-model="paikallinenOpintojakso.arviointi" :is-editable="false"></ep-content>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpContent from '@shared/components/EpContent/EpContent.vue';

@Component({
  components: {
    EpContent,
  },
})
export default class EpOpintojaksonArviointi extends Vue {
  @Prop({ required: false })
  private opetussuunnitelmaStore!: any;

  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private opintojaksonOppiaineidenTiedot!: any;

  @Prop({ required: false, default: true })
  private showEmptyAlert!: boolean;

  @Prop({ required: false, default: true })
  private showPerustesisalto!: boolean;
}
</script>

<style lang="scss">
</style>

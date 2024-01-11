<template>
<div>
  <div class="perustesisalto" v-for="(moduuli, idx) in value.moduulit" :key="idx + '-moduuli'">
    <div v-if="moduulitMap[moduuli.koodiUri]">
      <div class="moduuliotsikko"><h4>{{ $kaanna(moduulitMap[moduuli.koodiUri].nimi) }}</h4></div>
      <ep-prefix-list :value="moduulitMap[moduuli.koodiUri].sisallot" kohde="kohde" arvot="sisallot"></ep-prefix-list>
    </div>
  </div>

  <div v-for="(paikallinenOpintojakso, idx) in value.paikallisetOpintojaksot" :key="idx + 'opintojakso'">
    <div class="perustesisalto" v-if="paikallinenOpintojakso.keskeisetSisallot.length > 0">
      <div class="moduuliotsikko"><h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4></div>
      <ep-list
        :is-editable="false"
        lisays="lisaa-tavoite"
        kentta="kuvaus"
        v-model="paikallinenOpintojakso.keskeisetSisallot" />
    </div>
  </div>

  <div class="moduuliotsikko" v-if="value.keskeisetSisallot.length > 0 || showEmptyAlert"><h4>{{ $t('paikallinen-lisays-keskeiset-sisallot') }}</h4></div>
  <div class="alert alert-info" v-if="!isEditing && value.keskeisetSisallot && value.keskeisetSisallot.length === 0 && showEmptyAlert">{{ $t('ei-paikallista-tarkennusta') }}</div>
  <ep-list
    :is-editable="isEditing"
    lisays="lisaa-keskeinen-sisalto"
    kentta="kuvaus"
    v-model="value.keskeisetSisallot">
  </ep-list>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpPrefixList from '@shared/components/EpPrefixList/EpPrefixList.vue';
import EpList from '@shared/components/forms/EpList.vue';

@Component({
  components: {
    EpPrefixList,
    EpList,
  },
})
export default class EpOpintojaksonKeskeisetSisallot extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private moduulitMap!: any;

  @Prop({ required: false, default: true })
  private showEmptyAlert!: boolean;
}
</script>

<style lang="scss">

</style>

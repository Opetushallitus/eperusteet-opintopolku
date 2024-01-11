<template>
<div>
  <div v-if="showPerustesisalto">
    <div class="perustesisalto" v-for="(oppiaine, idx) in opintojaksonOppiaineidenTiedot" :key="idx">
      <div v-if="oppiaine.laajaAlaisetOsaamiset && oppiaine.laajaAlaisetOsaamiset.kuvaus">
        <div class="moduuliotsikko"><h4 v-html="$kaanna(oppiaine.nimi)"></h4></div>
        <ep-content
          layout="normal"
          :opetussuunnitelma-store="opetussuunnitelmaStore"
          :value="oppiaine.laajaAlaisetOsaamiset.kuvaus"
          help="ohje-lyhyt-laaja-alainen"></ep-content>
      </div>
      <div v-else-if="oppiaine.laajaAlainenOsaaminen">
        <div class="moduuliotsikko"><h4 v-html="$kaanna(oppiaine.nimi)"></h4></div>
        {{ oppiaine.laajaAlainenOsaaminen }}
        <ep-content v-for="(laajalainenosaaminen, idx) in oppiaine.laajaAlainenOsaaminen" :key="idx"
            layout="normal" :opetussuunnitelma-store="opetussuunnitelmaStore" :value="laajalainenosaaminen.kuvaus"></ep-content>
      </div>
    </div>
  </div>

  <div v-if="showEmptyAlert || value.laajaAlainenOsaaminen.length > 0">
    <div class="moduuliotsikko"><h4>{{ $t('paikallinen-lisays-opintojakso-laaja-alainen') }}</h4></div>
    <div class="paikallinen-laaja-alainen" v-for="(lo, idx) in value.laajaAlainenOsaaminen" :key="idx + '-paikallinen'">
      <div slot="header">
        <span v-if="laajaAlaisetKooditByUri[lo.koodi]">
          <h5 class="d-inline">{{ $kaanna(laajaAlaisetKooditByUri[lo.koodi].nimi) }}</h5>
          <b-button variant="link" @click.stop="poistaLaaja(lo)" v-if="isEditing">
            <EpMaterialIcon>close</EpMaterialIcon>
          </b-button>
        </span>
      </div>
      <ep-content
        v-if="lo.kuvaus"
        layout="normal"
        v-model="lo.kuvaus"
        :is-editable="isEditing"></ep-content>
    </div>

    <div class="alert alert-info" v-if="!isEditing && value.laajaAlainenOsaaminen.length === 0">{{ $t('ei-paikallista-tarkennusta') }}</div>
  </div>

  <b-dropdown v-if="isEditing" :text="$t('lisaa-laaja-alainen-osaaminen')" variant="primary" class="mb-4">
    <b-dropdown-item-button
      @click="addLaaja(laaja)"
      v-for="(laaja, index) in laajaAlaistenKoodit"
      :key="index+'addlaaja'"
      :disabled="laaja.hasPaikallinenKuvaus">
      {{ $kaanna(laaja.nimi) }}
    </b-dropdown-item-button>
  </b-dropdown>

  <div v-for="(paikallinenOpintojakso, index) in value.paikallisetOpintojaksot" :key="index+'laaja'">
    <div v-if="paikallinenOpintojakso.laajaAlainenOsaaminen && paikallinenOpintojakso.laajaAlainenOsaaminen.length > 0">
      <div class="moduuliotsikko"><h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4></div>
      <div class="paikallinen-laaja-alainen" v-for="(lo, index) in paikallinenOpintojakso.laajaAlainenOsaaminen" :key="index+'paik-laaja-osa'">
        <div slot="header" class="moduuliotsikko">
          <span v-if="laajaAlaisetKooditByUri[lo.koodi]">
            <h5>{{ $kaanna(laajaAlaisetKooditByUri[lo.koodi].nimi) }}</h5>
          </span>
        </div>
        <ep-content
          v-if="lo.kuvaus"
          layout="normal"
          v-model="lo.kuvaus"
          :is-editable="false"></ep-content>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

@Component({
  components: {
    EpContent,
    EpMaterialIcon,
  },
})
export default class EpOpintojaksonLaajaAlaisetOsaamiset extends Vue {
  @Prop({ required: false })
  private opetussuunnitelmaStore!: any;

  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private opintojaksonOppiaineidenTiedot!: any;

  @Prop({ required: true })
  private laajaAlaistenKoodit!: any;

  @Prop({ required: false, default: true })
  private showEmptyAlert!: boolean;

  @Prop({ required: false, default: true })
  private showPerustesisalto!: boolean;

  get laajaAlaisetKooditByUri() {
    return _.keyBy(this.laajaAlaistenKoodit, 'koodi');
  }
}
</script>

<style lang="scss">
</style>

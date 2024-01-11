<template>
<div>
  <div class="oppiaineet">
    <div v-if="isEditing">
      <div v-for="(oppiaineOpintojakso, idx) in paikallistenOppiaineidenOpintojaksot" :key="idx">
        <div v-if="oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi]">
          {{ $kaanna(oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi].nimi) }}
          <ep-opintojakso-select :options="oppiaineOpintojakso.opintojaksot" v-model="value.paikallisetOpintojaksot" :is-editing="isEditing"/>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="(oppiaineOpintojakso, idx) in esitettavaPaikallistenOppiaineidenOpintojaksot" :key="idx">
        <div v-if="oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi]">
          {{ $kaanna(oppiaineetMap[oppiaineOpintojakso.oppiaine.koodi].nimi) }}
          <ep-opintojakso-select v-model="oppiaineOpintojakso.opintojaksot" :is-editing="isEditing"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { koodiSorters } from '@shared/utils/perusteet';

import EpOpintojaksoSelect from './EpOpintojaksoSelect.vue';

@Component({
  components: {
    EpOpintojaksoSelect,
  },
})
export default class EpOpintojaksonOpintojaksot extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  @Prop({ required: true })
  private opintojaksot!: any[];

  @Prop({ required: true })
  private oppiaineetMap!: any;

  @Prop({ required: true })
  private oppiaineetJaOppimaarat!: any[];

  @Prop({ required: true })
  private oppiaineet!: any[];

  get oppiaineidenModuulit() {
    return _.chain(this.oppiaineetJaOppimaarat)
      .map((oa: any) => {
        if (oa.perusteenOppiaineUri) {
          return {
            ...oa,
            moduulit: this.oppiaineetMap[oa.perusteenOppiaineUri].moduulit,
          };
        }
        else {
          return oa;
        }
      })
      .value();
  }

  get oppiaineetJoiltaValittuModuuli() {
    return _.chain(this.oppiaineidenModuulit)
      .filter(oppiaineMod => _.some(_.map(oppiaineMod.moduulit, 'koodi.uri'), (oppainemoduri) => _.includes(_.map(this.value!.moduulit, 'koodiUri'), oppainemoduri)))
      .map('koodi.uri')
      .value();
  }

  get editoitavaOpintojaksoValittuToisessaOpintojaksossa() {
    return !_.isEmpty(_.filter(this.opintojaksot, opintojakso => _.includes(_.map(opintojakso.paikallisetOpintojaksot, 'koodi'), this.value!.koodi)));
  }

  get paikallistenOppiaineidenOpintojaksot() {
    if (this.editoitavaOpintojaksoValittuToisessaOpintojaksossa) {
      return [];
    }

    return _.chain(this.oppiaineet)
      .filter('isPaikallinenOppiaine')
      .map((oppiaine) => {
        return {
          oppiaine,
          opintojaksot: _.chain(this.opintojaksot)
            // valittavalla ei saa olla paikallisia opintojaksoja (ei saa olla parentti)
            .filter((opintojakso) => _.isEmpty(opintojakso.paikallisetOpintojaksot))
            // valittavassa opintojaksossa on editoitavan opintojakson oppiaine
            .filter((opintojakso) => _.includes(_.map(opintojakso.oppiaineet, 'koodi'), oppiaine.koodi))
            // valittava ei ole editoitava itse
            .filter((opintojakso) => opintojakso.koodi !== this.value!.koodi)
            .value(),
        };
      })
      .filter(oppiaine => !_.isEmpty(oppiaine.opintojaksot))
      .reject(oppiaine => _.includes(this.oppiaineetJoiltaValittuModuuli, oppiaine.oppiaine.koodi))
      .sortBy(...koodiSorters() as any[])
      .value();
  }

  get esitettavaPaikallistenOppiaineidenOpintojaksot() {
    return _.chain(this.oppiaineet)
      .filter('isPaikallinenOppiaine')
      .map((oppiaine) => {
        return {
          oppiaine,
          opintojaksot: _.filter(this.value!.paikallisetOpintojaksot, (paikallinenOpintojakso) => _.includes(_.map(paikallinenOpintojakso.oppiaineet, 'koodi'), oppiaine.koodi)),
        };
      })
      .filter(oppiaineOpintojakso => !_.isEmpty(oppiaineOpintojakso.opintojaksot))
      .sortBy(...koodiSorters())
      .value();
  }
}
</script>

<style lang="scss">
</style>

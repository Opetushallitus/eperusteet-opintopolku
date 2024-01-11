<template>
  <KoulutustyyppiSelect v-model="model" :koulutustyypit="koulutustyyppiVaihtoehdot" :koulutustyyppiryhmat="koulutustyyppiryhmat" :isEditing="isEditing">
    <template v-slot:colorindicator="{ koulutustyyppi }">
      <EpColorIndicator :size="10" :kind="koulutustyyppiColors[koulutustyyppi] || koulutustyyppi"/>
    </template>
  </KoulutustyyppiSelect>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { EperusteetKoulutustyypit, EperusteetKoulutustyyppiRyhmat, Toteutus } from '@shared/utils/perusteet';
import KoulutustyyppiSelect from '@shared/components/forms/EpKoulutustyyppiSelect.vue';

@Component({
  components: {
    EpColorIndicator,
    KoulutustyyppiSelect,
  },
})
export default class EpMaarayskokoelmaKoulutustyyppiSelect extends Vue {
  @Prop({ required: true })
  value!: string | string[];

  @Prop({ default: false })
  isEditing!: boolean;

  @Prop()
  koulutustyypit!: string[];

  get model() {
    return this.value;
  }

  set model(val) {
    this.$emit('input', val);
  }

  get koulutustyyppiVaihtoehdot() {
    if (this.koulutustyypit) {
      return this.koulutustyypit;
    }

    return [
      ...EperusteetKoulutustyypit,
      'opistovuosi-oppivelvollisille',
      'muu-ammatillinen-koulutus',
      'kotoutumiskoulutus',
    ];
  }

  get koulutustyyppiColors() {
    return {
      'opistovuosi-oppivelvollisille': 'vapaasivistystyo',
      'muu-ammatillinen-koulutus': 'ammatillinen',
      'kotoutumiskoulutus': 'kotoutumiskoulutus',
    };
  }

  get koulutustyyppiryhmat() {
    return {
      ...EperusteetKoulutustyyppiRyhmat,
      [Toteutus.AMMATILLINEN]: [
        ...EperusteetKoulutustyyppiRyhmat[Toteutus.AMMATILLINEN],
        'muu-ammatillinen-koulutus',
      ],
      [Toteutus.VAPAASIVISTYSTYO]: [
        ...EperusteetKoulutustyyppiRyhmat[Toteutus.VAPAASIVISTYSTYO],
        'opistovuosi-oppivelvollisille',
      ],
      [Toteutus.KOTOUTUMISKOULUTUS]: [
        ...EperusteetKoulutustyyppiRyhmat[Toteutus.KOTOUTUMISKOULUTUS],
        'kotoutumiskoulutus',
      ],
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

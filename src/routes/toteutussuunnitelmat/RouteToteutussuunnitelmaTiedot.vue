<template>
  <div>
    <ep-toteutussuunnitelma-tiedot
      v-if="!isVapaasivistystyo"
      :store="opetussuunnitelmaDataStore"
    />
    <ep-opetussuunnitelma-tiedot
      v-if="isVapaasivistystyo"
      :store="opetussuunnitelmaDataStore"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpToteutussuunnitelmaTiedot from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTiedot.vue';
import EpOpetussuunnitelmaTiedot from '@/components/EpToteutussuunnitelma/EpOpetussuunnitelmaTiedot.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { AmmatillisetKoulutustyypit, VapaasivistystyoKoulutustyypit } from '@shared/utils/perusteet';
import { Koulutustyyppi } from '@shared/tyypit';

@Component({
  components: {
    EpToteutussuunnitelmaTiedot,
    EpOpetussuunnitelmaTiedot,
  },
})
export default class RouteToteutussuunnitelmaTiedot extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get isVapaasivistystyo() {
    return _.includes(VapaasivistystyoKoulutustyypit, this.opetussuunnitelmaDataStore.koulutustyyppi);
  }
}
</script>

<style scoped lang="scss">

</style>

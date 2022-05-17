<template>
  <div>
    <ep-spinner v-if="!peruste" />
  </div>
</template>

<script lang="ts">
import { Perusteet } from '@shared/api/eperusteet';
import { koulutustyypinRyhma } from '@shared/utils/perusteet';
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  },
})
export default class RouteReroute extends Vue {
  private peruste: any = null;

  async mounted() {
    this.peruste = (await Perusteet.getKokoSisalto(this.perusteId)).data;
    if (koulutustyypinRyhma(this.peruste.koulutustyyppi!) === 'ammatillinen') {
      this.$router.push(
        {
          name: 'ammatillinenkooste',
          params: {
            perusteId: _.toString(this.perusteId),
          },
        });
    }
    else {
      this.$router.push(
        {
          name: 'kooste',
          params: {
            perusteId: _.toString(this.perusteId),
            koulutustyyppi: koulutustyypinRyhma(this.peruste.koulutustyyppi!)!,
          },
        });
    }
  }

  get perusteId() {
    return _.toNumber(this.$route.params.perusteId);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

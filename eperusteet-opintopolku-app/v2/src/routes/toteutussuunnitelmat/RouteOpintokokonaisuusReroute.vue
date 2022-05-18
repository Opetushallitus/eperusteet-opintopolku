<template>
  <div class="container">
    <ep-spinner v-if="!haku" />
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { SisaltoviiteOpintokokonaisuusExternalDto, ExternalApi } from '@shared/api/amosaa';

@Component({
  components: {
    EpSpinner,
  },
})
export default class RouteOpintokokonaisuusReroute extends Vue {
  private haku: SisaltoviiteOpintokokonaisuusExternalDto | null = null;

  async mounted() {
    try {
      this.haku = (await ExternalApi.getPublicOpintokokonaisuusKoodilla(this.koodiArvo)).data;
      this.$router.push({
        name: 'toteutussuunnitelmaSisalto',
        params: {
          toteutussuunnitelmaId: _.toString(this.haku.opetussuunnitelmaId),
          sisaltoviiteId: _.toString(this.haku.id),
          koulutustyyppi: 'vapaasivistystyo',
        },
      });
    }
    catch {
      this.$router.push({
        name: 'virhe',
        params: {
          lang: 'fi',
          virhekoodi: '404',
        },
      });
    }
  }

  get koodiArvo() {
    return this.$route.params.koodiarvo;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

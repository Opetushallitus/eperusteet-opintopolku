<template>
<div>
  <ep-spinner v-if="!koulutustyyppi" />
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-ohjeet') }}</p>
  <peruste-haku :peruste-haku-store="perusteHakuStoreOhjeet" tyyppi="opas"/>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import PerusteHaku from './PerusteHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import { Meta } from '@shared/utils/decorators';


@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteHaku,
  },
})
export default class RouteAmmatillinenOhjeet extends Vue {
  private perusteHakuStoreNormaali = new PerusteHakuStore();
  private perusteHakuStoreKoulutusvienti = new PerusteHakuStore({ koulutusvienti: true });
  private perusteHakuStoreOhjeet = new PerusteHakuStore({
    perusteTyyppi: 'opas',
    koulutustyyppi: [],
  });

  get koulutustyyppi() {
    return 'koulutustyyppi_1';
  }

  get murupolku() {
    return [{
      label: 'ammatillinen-koulutus',
      location: {
        name: 'ammatillinenSelaus',
      },
    }];
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('ammatillinen-koulutus'),
    };
  }
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

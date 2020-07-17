<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-ohjeet') }}</p>
  <peruste-ammatillinen-haku :peruste-haku-store="perusteHakuStoreOhjeet" tyyppi="opas"/>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import { OpasStore } from '@/stores/OpasStore';

@Component({
  components: {
    PerusteAmmatillinenHaku,
  },
})
export default class RouteAmmatillinenOhjeet extends Vue {
  private perusteHakuStoreOhjeet = new PerusteHakuStore({
    perusteTyyppi: 'opas',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    koulutusvienti: false,
    siirtyma: false,
    poistunut: false,
    tutkintonimikkeet: false,
    tutkinnonosat: false,
    osaamisalat: false,
  });
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-ohjeet') }}</p>
  <peruste-haku :peruste-haku-store="perusteHakuStoreOhjeet" tyyppi="opas"/>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PerusteHaku from './PerusteHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';


@Component({
  components: {
    PerusteHaku,
  },
})
export default class RouteAmmatillinenOhjeet extends Vue {
  private perusteHakuStoreOhjeet = new PerusteHakuStore({
    perusteTyyppi: 'opas',
    koulutustyyppi: [],
  });
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

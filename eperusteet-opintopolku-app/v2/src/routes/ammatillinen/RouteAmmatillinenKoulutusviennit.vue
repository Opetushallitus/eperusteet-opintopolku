<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-koulutusvienti') }}</p>
  <peruste-haku :peruste-haku-store="perusteHakuStoreKoulutusvienti" tyyppi="kooste"/>
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
export default class RouteAmmatillinenKoulutusviennit extends Vue {
  private perusteHakuStoreKoulutusvienti = new PerusteHakuStore({ koulutusvienti: true });
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

<template>
<div>
  <slot />
  <p class="kuvaus">{{ $t('kooste-kuvaus-koulutusvienti') }}</p>
  <peruste-ammatillinen-haku :peruste-haku-store="perusteHakuStoreKoulutusvienti" tyyppi="kooste"/>
</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import { Kielet } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';

@Component({
  components: {
    PerusteAmmatillinenHaku,
  },
})
export default class RouteAmmatillinenKoulutusviennit extends Vue {
  private perusteHakuStoreKoulutusvienti = new PerusteHakuStore({ koulutusvienti: true });

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  @Watch('kieli')
  async kieliChanged() {
    if (this.kieli === Kieli.en) {
      this.perusteHakuStoreKoulutusvienti.perusteet = [];
    }
  }
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

<template>
  <div>
    <slot />
    <p class="kuvaus">
      {{ $t('kooste-kuvaus-ohjeet') }}
    </p>
    <peruste-ammatillinen-haku
      :peruste-haku-store="perusteHakuStoreOhjeet"
      tyyppi="opas"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { AmmatillinenOpasHakuStore } from '@/stores/AmmatillinenOpasHakuStore';

@Component({
  components: {
    PerusteAmmatillinenHaku,
  },
})
export default class RouteAmmatillinenOhjeet extends Vue {
  private perusteHakuStoreOhjeet = new AmmatillinenOpasHakuStore();
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

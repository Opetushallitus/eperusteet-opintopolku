<template>
<div>
  <ep-spinner v-if="!koulutustyyppi" />
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
    <template slot="header">
      {{ $t('ammatillinen-koulutus') }}
    </template>
    <!-- Todo: UX-kuvien mukaiseksi -->
    <b-tabs content-class="mt-3" :no-fade="true">
      <b-tab :title="$t('perusteet')">
        <p class="kuvaus" v-html="$t('kooste-kuvaus-ammatillinen-koulutus')"></p>
        <p class="kuvaus" v-html="$t('kooste-kuvaus-perusteet')"></p>
        <peruste-haku :peruste-haku-store="perusteHakuStoreNormaali" />
      </b-tab>
      <b-tab :title="$t('koulutuksen-jarjestajat')">
        <p class="kuvaus" v-html="$t('kooste-kuvaus-jarjestajat')"></p>
      </b-tab>
      <b-tab :title="$t('ohjeet-ja-materiaalit')">
        <p class="kuvaus" v-html="$t('kooste-kuvaus-ohjeet')"></p>
        <peruste-haku :peruste-haku-store="perusteHakuStoreOhjeet" />
      </b-tab>
      <b-tab :title="$t('koulutusvienti')">
        <p class="kuvaus" v-html="$t('kooste-kuvaus-koulutusvienti')"></p>
        <peruste-haku :peruste-haku-store="perusteHakuStoreKoulutusvienti" />
      </b-tab>
    </b-tabs>
  </ep-header>
</div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import PerusteHaku from './PerusteHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';


@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteHaku,
  },
})
export default class RouteAmmatillinenSelaus extends Vue {
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
      label: this.$t('ammatillinen-koulutus'),
      location: {
        name: 'ammatillinenSelaus',
      },
    }];
  }
}
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>

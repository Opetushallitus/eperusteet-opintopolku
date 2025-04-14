<template>
  <router-view v-if="oppiaine" />

  <div
    v-else
    class="content"
  >
    <h2>{{ $kaanna(vaihe.nimi) }}</h2>

    <div
      v-if="vaihe.siirtymaEdellisesta"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.siirtymaEdellisesta.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.siirtymaEdellisesta.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="vaihe.tehtava"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.tehtava.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.tehtava.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="vaihe.siirtymaSeuraavaan"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.siirtymaSeuraavaan.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.siirtymaSeuraavaan.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="vaihe.paikallisestiPaatettavatAsiat"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.paikallisestiPaatettavatAsiat.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.paikallisestiPaatettavatAsiat.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaineet && oppiaineet.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('oppiaineet') }}</h3>
      <div
        v-for="oppiaine in oppiaineet"
        :key="'oppiaine'+oppiaine.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        <router-link :to="oppiaine.route">
          {{ $kaanna(oppiaine.nimi) }}
        </router-link>
      </div>
    </div>

    <div
      v-if="tavoitealueet && tavoitealueet.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('opetuksen-tavoitealueet') }}</h3>
      <div
        v-for="tavoitealue in tavoitealueet"
        :key="'tavoitealue'+tavoitealue.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        {{ $kaanna(tavoitealue.nimi) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component({
  components: {
    EpContentViewer,
  },
})
export default class RouteAipeVaihe extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get vaiheId() {
    return _.toNumber(this.$route.params.vaiheId);
  }

  get vaihe() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.vaiheId });
  }

  get oppiaineet() {
    if (this.vaihe) {
      return _.map(this.vaihe.oppiaineet, oppiaine => {
        return {
          ...oppiaine,
          route: { name: 'aipeoppiaine', params: { oppiaineId: _.toString(oppiaine.id) } },
        };
      });
    }
  }

  get tavoitealueet() {
    if (this.vaihe) {
      return this.vaihe.opetuksenKohdealueet;
    }
  }

  get oppiaine() {
    return this.$route.params.oppiaineId;
  }

  get fields() {
    return [{
      key: 'nimi',
      thStyle: {
        display: 'none',
      },
    }];
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

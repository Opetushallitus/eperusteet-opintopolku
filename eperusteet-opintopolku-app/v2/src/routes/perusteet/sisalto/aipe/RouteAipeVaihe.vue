<template>

  <router-view v-if="oppiaine" />

  <div v-else class="content">

    <h2>{{$kaanna(vaihe.nimi)}}</h2>

    <div class="mt-4" v-if="vaihe.siirtymaEdellisesta">
      <h3>{{ $kaanna(vaihe.siirtymaEdellisesta.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(vaihe.siirtymaEdellisesta.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="vaihe.tehtava">
      <h3>{{ $kaanna(vaihe.tehtava.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(vaihe.tehtava.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="vaihe.siirtymaSeuraavaan">
      <h3>{{ $kaanna(vaihe.siirtymaSeuraavaan.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(vaihe.siirtymaSeuraavaan.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="vaihe.paikallisestiPaatettavatAsiat">
      <h3>{{ $kaanna(vaihe.paikallisestiPaatettavatAsiat.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(vaihe.paikallisestiPaatettavatAsiat.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-5" v-if="oppiaineet && oppiaineet.length > 0">
      <h3>{{$t('oppiaineet')}}</h3>
      <b-table striped :items="oppiaineet" :fields="fields">
        <template v-slot:cell(nimi)="data">
          <router-link :to="data.item.route">
            {{$kaanna(data.item.nimi)}}
          </router-link>
        </template>

      </b-table>
    </div>

    <div class="mt-5" v-if="tavoitealueet && tavoitealueet.length > 0">
      <h3>{{$t('opetuksen-tavoitealueet')}}</h3>
      <b-table striped :items="tavoitealueet" :fields="fields">
          <template v-slot:cell(nimi)="data">
            {{$kaanna(data.item.nimi)}}
          </template>

        </b-table>
    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AipeVaiheStore } from '@/stores/AipeVaiheStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component({
  components: {
    EpContentViewer,
  },
})
export default class RouteAipeVaihe extends Vue {
  @Prop({ required: true })
  private aipeVaiheStore!: AipeVaiheStore;

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get vaihe() {
    return this.aipeVaiheStore.vaihe.value;
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

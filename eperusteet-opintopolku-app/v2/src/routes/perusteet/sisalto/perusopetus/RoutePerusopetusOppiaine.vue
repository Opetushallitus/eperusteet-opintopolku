<template>
  <div class="content">

    <ep-spinner v-if="!oppiaine" />

    <div v-else>

      <h2>{{$kaanna(oppiaine.nimi)}}</h2>

      <div class="mt-4" v-if="hasContent(oppiaine.tehtava)">
        <h3>{{$kaanna(oppiaine.tehtava.otsikko)}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaine.tehtava.teksti)" :kuvat="kuvat" />
      </div>

      <b-tabs class="ml-0 pl-0 mt-4" v-model="tabIndex">
        <b-tab class="mt-4" v-for="(vlk, index) in oppiaine.vuosiluokkakokonaisuudet" :key="'vlk'+index" :title="$kaanna(vlk.nimi)">

          <h2>{{$kaanna(vlk.nimi)}}</h2>

          <div class="mt-4" v-if="hasContent(vlk.tehtava)">
            <h3>{{$kaanna(vlk.tehtava.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.tehtava.teksti)" :kuvat="kuvat" />
          </div>

          <div class="mt-4" v-if="hasContent(vlk.tyotavat)">
            <h3>{{$kaanna(vlk.tyotavat.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.tyotavat.teksti)" :kuvat="kuvat" />
          </div>

          <div class="mt-4" v-if="hasContent(vlk.ohjaus)">
            <h3>{{$kaanna(vlk.ohjaus.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.ohjaus.teksti)" :kuvat="kuvat" />
          </div>

          <div class="mt-4" v-if="hasContent(vlk.arviointi)">
            <h3>{{$kaanna(vlk.arviointi.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.arviointi.teksti)" :kuvat="kuvat" />
          </div>

          <div class="mt-4" v-if="hasContent(vlk.arviointi)">
            <h3>{{$kaanna(vlk.arviointi.otsikko)}}</h3>
            <ep-content-viewer :value="$kaanna(vlk.arviointi.teksti)" :kuvat="kuvat" />
          </div>

        </b-tab>
      </b-tabs>

      <div class="mt-4" v-if="oppimaarat.length > 0">

        <h3>{{$t('oppimaarat')}}</h3>

        <b-table striped :items="oppimaarat" :fields="oppimaaratFields">
          <template v-slot:cell(nimi)="data">
            <router-link :to="data.item.route">
              {{$kaanna(data.item.nimi)}}
            </router-link>
          </template>

        </b-table>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { PerusopetusOppiaineStore } from '@/stores/PerusopetusOppiaineStore';
import { Kielet } from '@shared/stores/kieli';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
  },
})
export default class RoutePerusopetusOppiaine extends Vue {
  @Prop({ required: true })
  private perusopetusOppiaineStore!: PerusopetusOppiaineStore;

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private tabIndex = 0;

  mounted() {
    if (this.$route.params.vlkId && this.oppiaine) {
      const vlk = _.head(_.filter(this.oppiaine.vuosiluokkakokonaisuudet, vlk => _.toString(_.get(vlk, '_vuosiluokkaKokonaisuus')) === _.toString(this.$route.params.vlkId)));
      this.tabIndex = _.indexOf(this.oppiaine.vuosiluokkakokonaisuudet, vlk);
    }
  }

  get oppiaine() {
    return this.perusopetusOppiaineStore.oppiaine.value;
  }

  hasContent(obj) {
    return _.isObject(obj) && _.get(obj, 'teksti') && _.get(obj, 'teksti')[Kielet.getSisaltoKieli.value];
  }

  get oppimaaratFields() {
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

  get oppimaarat() {
    return _.map(this.oppiaine!.oppimaarat, oppimaara => {
      return {
        ...oppimaara,
        route: {
          name: this.$route.params.vlkId ? 'vuosiluokanoppiaine' : 'perusopetusoppiaine',
          params: {
            oppiaineId: _.toString(oppimaara.id),
            ...(this.$route.params.vlkId && { vlkId: this.$route.params.vlkId }),
          },
        },
      };
    });
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;

    ::v-deep .nav-tabs li a {
      margin-left: 0px !important;
    }
  }
</style>

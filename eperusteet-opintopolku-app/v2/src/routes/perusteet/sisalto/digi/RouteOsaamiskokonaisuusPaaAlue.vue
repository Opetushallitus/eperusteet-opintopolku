<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 class="otsikko mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>

      <ep-content-viewer :value="$kaanna(perusteenOsa.kuvaus)" :termit="termit" :kuvat="kuvat" />

      <b-form-group :label="$t('suodata-ikaryhman-mukaan')" class="mt-5 d-flex">
        <b-form-checkbox
            v-for="taso in tasot"
            :key="taso"
            :value="taso"
            v-model="selectedTasot"
            :options="tasot"
            button
            size="sm"
            button-variant="primary"
            class="mr-2 taso-chk">
            <div class="d-flex align-items-center">
              <div class="material-icons-outlined mr-2" v-if="selectedTaso(taso)">done</div>
              <div>{{$t(taso)}}</div>
            </div>
        </b-form-checkbox>
      </b-form-group>

      <EpCollapse :borderBottom="false" v-for="osaAlue in osaAlueet" :key="'osaalue' + osaAlue.id">
        <h3 slot="header" class="collapse-header">{{ $kaanna(osaAlue.nimi) }}</h3>

        <EpOsaAlue :value="osaAlue">
          <div slot="nimi" />
          <hr slot="tasokuvaus-postfix"/>
        </EpOsaAlue>

      </EpCollapse>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>

</template>

<script lang="ts">
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpOsaAlue from '@shared/components/EpOsaamiskokonaisuus/EpOsaAlue.vue';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
    EpCollapse,
    EpOsaAlue,
  },
})
export default class RouteOsaamiskokonaisuusPaaAlue extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  private selectedTasot: any[] = ['varhaiskasvatus', 'esiopetus', 'vuosiluokka_12', 'vuosiluokka_3456', 'vuosiluokka_789'];

  @Watch('current', { immediate: true })
  async fetchPerusteenOsa() {
    if (!this.current) {
      return;
    }
    await this.perusteenOsaStore.fetchPerusteenOsa();
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get perusteenOsa(): any {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get currentRoute() {
    return this.perusteDataStore.currentRoute;
  }

  get osaAlueet() {
    return _.map(this.perusteenOsa.osaAlueet, osaAlue => {
      return {
        ...osaAlue,
        tasokuvaukset: _.filter(osaAlue.tasokuvaukset, tasokuvaus => this.selectedTaso(tasokuvaus.taso)),
      };
    });
  }

  get tasot() {
    return _.chain(this.perusteenOsa.osaAlueet)
      .map('tasokuvaukset')
      .flatMap()
      .map(tasokuvaus => _.toLower(tasokuvaus.taso))
      .uniq()
      .value();
  }

  selectedTaso(taso) {
    return _.find(this.selectedTasot, selected => selected === _.toLower(taso));
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
}

::v-deep .collapse-button {
  background-color: $digitaalinen-osaaminen-color;
  padding: 0.3rem 0.6rem;
  margin-bottom: 16px;
}

.collapse-header {
  margin: 0;
}

.taso-chk {

  ::v-deep .btn {
    font-size: 0.8rem;
    border-radius: 10px;
  }

  .material-icons-outlined {
    font-size: 1rem;
  }
}

</style>

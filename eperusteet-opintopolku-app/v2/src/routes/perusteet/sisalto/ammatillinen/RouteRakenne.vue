<template>
  <div class="content">
    <ep-spinner v-if="!rakenne" />
    <div v-else>

      <h2>{{$t('tutkinnon-muodostuminen')}}</h2>

      <div class="mb-5" v-html="$kaanna(rakenne.kuvaus)" />

      <h3>{{$kaanna(peruste.nimi)}} {{laajuus}} {{$t('osaamispiste')}}</h3>
      <ep-search v-model="query" :placeholder="$t('etsi-rakenteesta')"/>

      <div class="rakennepohja mt-3">
        <div class="d-flex">
          <ep-button class="rakennetoggle" variant="link" @click="toggleRakenne()">{{$t(rakenneOsaSuljeTeksti)}}</ep-button>
          <ep-button variant="link" @click="toggleKuvaukset()">{{$t(rakenneOsaKuvasTeksti)}}</ep-button>

        </div>
        <div class="text-right rakenneotsikko">{{$t('osaamispiste')}}</div>
        <div class="rakenneosat">
          <peruste-rakenne-osa
            ref="rakenneosa"
            v-for="(osa, index) in filteredRakenneOsat"
            :key="'osa'+index"
            :rakenneosa="osa"
            :eiVanhempaa="true"
            :viimeinen="true">
          </peruste-rakenne-osa>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import PerusteRakenneOsa from '@/components/EpAmmatillinen/PerusteRakenneOsa.vue';
import { PerusteRakenneStore } from '@/stores/PerusteRakenneStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';

@Component({
  components: {
    EpSpinner,
    PerusteRakenneOsa,
    EpButton,
    EpSearch,
  },
})
export default class RouteRakenne extends Vue {
  @Prop({ required: true })
  private rakenneStore!: PerusteRakenneStore;

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private naytaRakenteet = false;
  private naytaKuvaukset = false;
  private query = '';

  get peruste() {
    return this.perusteDataStore.peruste;
  }

  get rakenne(): any {
    return this.rakenneStore.rakenne.value;
  }

  get rakenneOsat() {
    return this.rakenne.osat;
  }

  get filteredRakenneOsat() {
    return this.filterRakenneOsat(this.rakenneOsat);
  }

  private filterRakenneOsat(osat: any[]) {
    return _.chain(osat)
      .map(osa => {
        return {
          ...osa,
          osat: this.filterRakenneOsat(osa.osat),
        };
      })
      .filter(osa => {
        const nimi = osa.nimi || osa.tutkinnonosa.nimi;
        return _.size(osa.osat) > 0 || Kielet.search(this.query, nimi);
      })
      .map(osa => {
        return {
          ...osa,
          osat: _.size(osa.osat) > 0 ? osa.osat : this.flattenedRakenneOsat[osa.tunniste].osat,
        };
      })
      .value();
  }

  get flattenedRakenneOsat() {
    return _.keyBy(this.flattenRakenneOsat(this.rakenneOsat), 'tunniste');
  }

  private flattenRakenneOsat(osat: any[]) {
    return _.chain(osat)
      .map(osa => {
        return [
          osa,
          ...this.flattenRakenneOsat(osa.osat),
        ];
      })
      .flatMap()
      .value();
  }

  get laajuus() {
    if (this.rakenne.muodostumisSaanto && this.rakenne.muodostumisSaanto.laajuus) {
      return this.rakenne.muodostumisSaanto.laajuus.maksimi;
    }
  }

  get rakenneOsaSuljeTeksti() {
    if (!this.naytaRakenteet) {
      return 'avaa-kaikki';
    }
    else {
      return 'sulje-kaikki';
    }
  }

  get rakenneOsaKuvasTeksti() {
    if (!this.naytaKuvaukset) {
      return 'nayta-ryhmien-kuvaukset';
    }
    else {
      return 'piilota-ryhmien-kuvaukset';
    }
  }

  toggleRakenne() {
    this.naytaRakenteet = !this.naytaRakenteet;
    _.forEach(this.$refs.rakenneosa, (rakenneosa: any) => rakenneosa.toggleRakenne(this.naytaRakenteet));
  }

  toggleKuvaukset() {
    this.naytaKuvaukset = !this.naytaKuvaukset;
    _.forEach(this.$refs.rakenneosa, (rakenneosa: any) => rakenneosa.toggleKuvaus(this.naytaKuvaukset));
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;

    .rakennepohja {
      background-color: $gray-lighten-5;
      padding: 20px;
    }

    .rakenneosat div:first-child {
      margin-top: -15px;
    }

    .rakenneotsikko {
      padding-right: 20px;
    }

  }

  ::v-deep .rakennetoggle .btn, ::v-deep .rakennetoggle .btn .teksti {
      padding-left: 0px !important;
  }

</style>

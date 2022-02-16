<template>
  <div class="peruste-rakenne">
    <ep-search class="query" v-model="query" :placeholder="$t('etsi-rakenteesta')"/>

    <div class="rakennepohja mt-3">
      <div class="d-flex">
        <ep-button class="rakennetoggle" variant="link" @click="toggleRakenne()">{{$t(rakenneOsaSuljeTeksti)}}</ep-button>
        <ep-button class="kuvaustoggle" variant="link" @click="toggleKuvaukset()">{{$t(rakenneOsaKuvasTeksti)}}</ep-button>

      </div>
      <div class="text-right rakenneotsikko">{{laajuustyyppi}}</div>
      <div class="rakenneosat">
        <peruste-rakenne-osa
          ref="rakenneosa"
          v-for="(osa, index) in filteredRakenneOsat"
          :key="'osa'+index"
          :rakenneosa="osa"
          :eiVanhempaa="true"
          :viimeinen="true">

          <template v-slot:nimi="{ rakenneosa }">
            <slot name="nimi" v-bind:rakenneosa="rakenneosa"></slot>
          </template>

        </peruste-rakenne-osa>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import PerusteRakenneOsa from '@/components/EpAmmatillinen/PerusteRakenneOsa.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';

@Component({
  components: {
    PerusteRakenneOsa,
    EpButton,
    EpSearch,
  },
})
export default class EpPerusteRakenne extends Vue {
  @Prop({ required: true })
  private rakenneOsat!: any[];

  private naytaRakenteet = false;
  private naytaKuvaukset = false;
  private query = '';

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
        let nimi = osa.nimi;
        if (osa.tutkinnonosa) {
          nimi = osa.tutkinnonosa.tutkinnonOsa.nimi;
        }
        return _.size(osa.osat) > 0 || (nimi && Kielet.search(this.query, nimi));
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

  get laajuustyyppi() {
    const laajuustyypit = _.chain(this.flattenRakenneOsat(this.rakenneOsat))
      .map(osa => {
        return {
          ..._.pickBy(osa.muodostumisSaanto, _.identity),
        };
      })
      .filter(muodostumisSaanto => !_.isEmpty(muodostumisSaanto))
      .map(muodostumisSaanto => _.keys(muodostumisSaanto))
      .flatMap()
      .uniq()
      .value();

    if (_.size(laajuustyypit) === 0 || _.size(laajuustyypit) > 1) {
      return '';
    }

    return _.includes(laajuustyypit, 'laajuus') ? this.$t('osaamispiste') : this.$t('kpl');
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .peruste-rakenne {

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

    ::v-deep .rakennetoggle .btn, ::v-deep .rakennetoggle .btn .teksti {
        padding-left: 0px !important;
    }
  }

</style>

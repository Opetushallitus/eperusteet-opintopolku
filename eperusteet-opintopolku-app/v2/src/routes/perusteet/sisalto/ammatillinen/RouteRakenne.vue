<template>
  <div class="content">
    <ep-spinner v-if="!rakenne || !peruste" />
    <div v-else>

      <h2>{{$t('tutkinnon-muodostuminen')}}</h2>

      <div class="mb-5" v-html="$kaanna(rakenne.kuvaus)" />

      <h3>{{$kaanna(peruste.nimi)}} <span v-if="laajuus">{{laajuus}} {{$t('osaamispiste')}}</span></h3>

      <ep-peruste-rakenne v-if="rakenneOsat" :rakenneOsat="rakenneOsat">
        <template v-slot:nimi="{ rakenneosa }">

          <div class="d-flex">
            <div v-if="rakenneosa.tutkinnonosa">
              <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: rakenneosa._tutkinnonOsaViite}}">
                <ep-color-indicator :tooltip="false" :id="'tutkinto'+rakenneosa._tutkinnonOsaViite" :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'" class="mr-2"/>
                {{$kaanna(rakenneosa.tutkinnonosa.tutkinnonOsa.nimi)}} <span v-if="rakenneosa.koodiArvo">({{rakenneosa.koodiArvo}})</span>
              </router-link>
              <b-popover :target="'tutkinto'+rakenneosa._tutkinnonOsaViite" :placement="'bottom'" triggers="hover">
                <span v-if="rakenneosa.pakollinen">{{$t('pakollinen-tutkinnon-osa')}}</span>
                <span v-if="!rakenneosa.pakollinen">{{$t('valinnainen-tutkinnon-osa')}}</span>
              </b-popover>
            </div>
            <span v-else>
              {{$kaanna(rakenneosa.nimi)}} <span v-if="rakenneosa.koodiArvo">({{rakenneosa.koodiArvo}})</span>
            </span>

          </div>
        </template>
      </ep-peruste-rakenne>
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
import EpPerusteRakenne from '@/components/EpAmmatillinen/EpPerusteRakenne.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';

@Component({
  components: {
    EpSpinner,
    PerusteRakenneOsa,
    EpButton,
    EpSearch,
    EpPerusteRakenne,
    EpColorIndicator,
  },
})
export default class RouteRakenne extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private naytaRakenteet = false;
  private naytaKuvaukset = false;
  private query = '';

  get peruste() {
    return this.perusteDataStore.peruste;
  }

  get rakenne() {
    return _.get(_.first(this.perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat')), 'rakenne');
  }

  get rakenneOsat() {
    return this.setRakenneOsaKoodi(this.rakenne.osat);
  }

  get perusteenTutkinnonosaViitteetById() {
    return _.keyBy(_.chain(this.perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat'))
      .map(st => st.tutkinnonOsaViitteet)
      .flatMap()
      .value(), 'id');
  }

  get perusteenTutkinnonosatById() {
    return _.keyBy(this.perusteDataStore.getJulkaistuPerusteSisalto('tutkinnonOsat'), 'id');
  }

  setRakenneOsaKoodi(rakenneOsat) {
    return _.map(rakenneOsat, rakenneosa => {
      let tutkinnonosaviite;
      let tutkinnonOsa;
      if (_.get(rakenneosa, '_tutkinnonOsaViite')) {
        tutkinnonosaviite = this.perusteenTutkinnonosaViitteetById[_.get(rakenneosa, '_tutkinnonOsaViite')];
        tutkinnonOsa = this.perusteenTutkinnonosatById[_.get(tutkinnonosaviite, '_tutkinnonOsa')];
      }
      return {
        ...rakenneosa,
        koodiArvo: this.getRakenneosaKoodiArvo(rakenneosa),
        osat: this.setRakenneOsaKoodi(rakenneosa.osat),
        ...(tutkinnonosaviite && { tutkinnonosa: {
          ...tutkinnonosaviite,
          tutkinnonOsa,
        } }),
      };
    });
  }

  getRakenneosaKoodiArvo(rakenneosa) {
    if (rakenneosa.tutkintonimike?.arvo) {
      return rakenneosa.tutkintonimike?.arvo;
    }

    if (rakenneosa.tutkinnonosa?.tutkinnonOsa?.koodi?.arvo) {
      return rakenneosa.tutkinnonosa?.tutkinnonOsa?.koodi?.arvo;
    }

    if (rakenneosa.osaamisala?.osaamisalakoodiArvo) {
      return rakenneosa.osaamisala?.osaamisalakoodiArvo;
    }
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
  }

</style>

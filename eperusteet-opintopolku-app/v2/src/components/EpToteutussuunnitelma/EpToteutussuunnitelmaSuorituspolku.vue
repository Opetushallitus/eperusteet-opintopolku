<template>
  <div>
    <h2>{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2>
    <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>

    <ep-spinner v-if="!rakenne" />

    <div v-else>
      <ep-content-viewer :value="$kaanna(rakenne.kuvaus)" :kuvat="kuvat"/>
      <ep-peruste-rakenne :rakenneOsat="filteredRakenneOsat">
        <template v-slot:nimi="{ rakenneosa }">

          <div v-if="rakenneosa.tutkinnonosa && rakenneosa.tutkinnonosaViite">
            <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: rakenneosa.tutkinnonosaViite.id}}">
              <ep-color-indicator :tooltip="false" :id="'tutkinto'+rakenneosa.tutkinnonosaViite.id" :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'" class="mr-2"/>
              {{$kaanna(rakenneosa.tutkinnonosa.nimi)}}
            </router-link>
            <b-popover :target="'tutkinto'+rakenneosa.tutkinnonosaViite.id" :placement="'bottom'" triggers="hover">
              <span v-if="rakenneosa.pakollinen">{{$t('pakollinen-tutkinnon-osa')}}</span>
              <span v-if="!rakenneosa.pakollinen">{{$t('valinnainen-tutkinnon-osa')}}</span>
            </b-popover>
          </div>
          <span v-else>
            {{$kaanna(rakenneosa.nimi)}}
          </span>

        </template>
      </ep-peruste-rakenne>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPerusteRakenne from '@/components/EpAmmatillinen/EpPerusteRakenne.vue';
import { PerusteRakenneStore } from '@/stores/PerusteRakenneStore';
import { TutkinnonosaViitteetStore } from '@/stores/TutkinnonosaViitteetStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpContentViewer,
    EpPerusteRakenne,
    EpSpinner,
    EpColorIndicator,
  },
})
export default class EpToteutussuunnitelmaSuorituspolku extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private opetussuunnitelma!: OpetussuunnitelmaDto;

  private perusteRakenneStore: PerusteRakenneStore | null = null;
  private tutkinnonosaViitteetStore: TutkinnonosaViitteetStore | null = null;

  mounted() {
    this.perusteRakenneStore = new PerusteRakenneStore(this.opetussuunnitelma.peruste!.perusteId!, this.opetussuunnitelma.suoritustapa!);
    this.tutkinnonosaViitteetStore = new TutkinnonosaViitteetStore(this.opetussuunnitelma);
  }

  get rakenne(): any {
    if (this.perusteRakenneStore) {
      return this.perusteRakenneStore.rakenne.value;
    }
  }

  get rakenneTutkinnonOsilla() {
    if (this.rakenne) {
      return this.setTutkinnonOsaViitteet(this.rakenne.osat);
    }
  }

  private setTutkinnonOsaViitteet(osat: any[]) {
    return _.chain(osat)
      .map(osa => {
        return {
          ...osa,
          tutkinnonosaViite: this.tutkinnonosaViitteet[_.get(osa, 'tutkinnonosa._tutkinnonOsa')],
          osat: this.setTutkinnonOsaViitteet(osa.osat),
        };
      })
      .value();
  }

  get filteredRakenneOsat() {
    if (this.rakenne) {
      return this.filterRakenneOsat(this.rakenneTutkinnonOsilla);
    }
  }

  private filterRakenneOsat(osat: any[]) {
    return _.chain(osat)
      .filter(osa => !_.includes(this.piilotetutTunnisteet, osa.tunniste))
      .map(osa => {
        return {
          ...osa,
          osat: this.filterRakenneOsat(osa.osat),
        };
      })
      .value();
  }

  get tutkinnonosaViitteet() {
    if (this.tutkinnonosaViitteetStore) {
      return _.keyBy(this.tutkinnonosaViitteetStore.tutkinnonosaViitteet.value, 'tosa.perusteentutkinnonosa');
    }

    return {};
  }

  get piilotetutTunnisteet() {
    return _.chain(this.sisaltoviite.suorituspolku!.rivit)
      .filter('piilotettu')
      .map('rakennemoduuli')
      .value();
  }
}
</script>

<style scoped lang="scss">

</style>

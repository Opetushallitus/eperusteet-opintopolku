<template>
  <div class="content">
    <ep-spinner v-if="fetching" />

    <div v-else-if="sisaltoviite">
      <ep-toteutussuunnitelma-tekstikappale v-if="sisaltoviite.tyyppi === 'tekstikappale'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />
      <ep-toteutussuunnitelma-tutkinnonosa v-else-if="sisaltoviite.tyyppi === 'tutkinnonosa'"
        :sisaltoviite="sisaltoviite"
        :perusteenTutkinnonosa="perusteenTutkinnonosa"
        :perusteenTutkinnonosaViite="perusteenTutkinnonosaViite"
        :kuvat="kuvat"
        :arviointiasteikot="arviointiasteikot"
      />
      <ep-toteutussuunnitelma-suorituspolku
        v-else-if="sisaltoviite.tyyppi === 'suorituspolku' || sisaltoviite.tyyppi === 'osasuorituspolku'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
      />
      <ep-toteutussuunnitelma-opintokokonaisuus
        v-else-if="sisaltoviite.tyyppi === 'opintokokonaisuus'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />

      <ep-toteutussuunnitelma-laajaalainen-osaaminen
        v-else-if="sisaltoviite.tyyppi === 'laajaalainenosaaminen'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />

      <ep-toteutussuunnitelma-koulutuksen-osat
        v-else-if="sisaltoviite.tyyppi === 'koulutuksenosat'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
      />

      <ep-toteutussuunnitelma-koulutuksen-osa
        v-else-if="sisaltoviite.tyyppi === 'koulutuksenosa'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
      />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { SisaltoviiteStore } from '@/stores/SisaltoviiteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpToteutussuunnitelmaTekstikappale from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTekstikappale.vue';
import EpToteutussuunnitelmaTutkinnonosa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTutkinnonosa.vue';
import EpToteutussuunnitelmaSuorituspolku from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaSuorituspolku.vue';
import EpToteutussuunnitelmaOpintokokonaisuus from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOpintokokonaisuus.vue';
import EpToteutussuunnitelmaLaajaalainenOsaaminen from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaLaajaalainenOsaaminen.vue';
import EpToteutussuunnitelmaKoulutuksenOsat from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsat.vue';
import EpToteutussuunnitelmaKoulutuksenOsa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { deepFind } from '@shared/utils/helpers';

@Component({
  components: {
    EpSpinner,
    EpToteutussuunnitelmaTekstikappale,
    EpToteutussuunnitelmaTutkinnonosa,
    EpToteutussuunnitelmaSuorituspolku,
    EpToteutussuunnitelmaOpintokokonaisuus,
    EpToteutussuunnitelmaLaajaalainenOsaaminen,
    EpToteutussuunnitelmaKoulutuksenOsat,
    EpToteutussuunnitelmaKoulutuksenOsa,
  },
})
export default class RouteToteutussuunnitelmaSisalto extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get fetching() {
    return !this.sisaltoviite;
  }

  get sisaltoviiteId() {
    return _.toNumber(this.$route.params.sisaltoviiteId);
  }

  get sisaltoviite() {
    const julkaistuSisalto = this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.sisaltoviiteId });

    if (_.get(julkaistuSisalto, 'tosa')) {
      const tutkinnonosat = this.opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat');
      const tutkinnonosa = _.find(tutkinnonosat, tutkinnonosa => tutkinnonosa.tosa.id === julkaistuSisalto.tosa.id);

      return {
        ...julkaistuSisalto,
        tosa: tutkinnonosa.tosa,
      };
    }

    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.sisaltoviiteId });
  }

  get perusteenTutkinnonosaViite() {
    if (this.sisaltoviite.tosa) {
      return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ '_tutkinnonOsa': _.toString(this.sisaltoviite.tosa.perusteentutkinnonosa) });
    }
  }

  get perusteenTutkinnonosa() {
    if (this.sisaltoviite.tosa) {
      return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: _.toNumber(this.sisaltoviite.tosa.perusteentutkinnonosa) });
    }
  }

  get opetussuunnitelma() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma;
  }

  get kuvat() {
    return [
      ...this.opetussuunnitelmaDataStore.kuvat,
      ...this.opetussuunnitelmaDataStore.perusteKuvat,
    ];
  }

  get arviointiasteikot() {
    return this.opetussuunnitelmaDataStore.arviointiasteikot;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;

  }

</style>

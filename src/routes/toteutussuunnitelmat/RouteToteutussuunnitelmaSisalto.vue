<template>
  <div class="content">
    <ep-spinner v-if="fetching" />

    <div v-else-if="sisaltoviite" class="content">

      <portal to="toteutussuunnitelma-sisalto-header" >
        <h2 v-if="sisaltoviite.nimi">
          <span v-if="numerointi">{{numerointi}}</span>
          {{$kaanna(sisaltoviite.nimi)}}
        </h2>
      </portal>

      <ep-toteutussuunnitelma-tekstikappale v-if="sisaltoviite.tyyppi === 'tekstikappale'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
      />

      <ep-toteutussuunnitelma-tutkinnonosa v-else-if="sisaltoviite.tyyppi === 'tutkinnonosa'"
        :sisaltoviite="sisaltoviite"
        :perusteenTutkinnonosa="perusteenTutkinnonosa"
        :perusteenTutkinnonosaViite="perusteenTutkinnonosaViite"
        :kuvat="kuvat"
        :arviointiasteikot="arviointiasteikot"
        :julkaisukielet="opetussuunnitelma.julkaisukielet"
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
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
      />

      <ep-toteutussuunnitelma-koulutuksen-osat
        v-else-if="sisaltoviite.tyyppi === 'koulutuksenosat'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
      />

      <ep-toteutussuunnitelma-koulutuksen-osa
        v-else-if="sisaltoviite.tyyppi === 'koulutuksenosa'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
      />

      <ep-toteutussuunnitelma-koto-laaja-alainen-osaaminen
        v-else-if="sisaltoviite.tyyppi === 'koto_laajaalainenosaaminen'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
      />

      <ep-toteutussuunnitelma-koto-opinto-sisalto
        v-else-if="sisaltoviite.tyyppi === 'koto_kielitaitotaso'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
        sisaltoViiteSisalto="kotoKielitaitotaso"
      />

      <ep-toteutussuunnitelma-koto-opinto-sisalto
        v-else-if="sisaltoviite.tyyppi === 'koto_opinto'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
        sisaltoViiteSisalto="kotoOpinto"
      />

      <EpToteutussuunnitelmaOsaamismerkki v-else-if="sisaltoviite.tyyppi === 'osaamismerkki'"
                                          :sisaltoviite="sisaltoviite"
                                          :kuvat="kuvat">
      </EpToteutussuunnitelmaOsaamismerkki>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpToteutussuunnitelmaTekstikappale from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTekstikappale.vue';
import EpToteutussuunnitelmaTutkinnonosa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTutkinnonosa.vue';
import EpToteutussuunnitelmaSuorituspolku from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaSuorituspolku.vue';
import EpToteutussuunnitelmaOpintokokonaisuus from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOpintokokonaisuus.vue';
import EpToteutussuunnitelmaLaajaalainenOsaaminen from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaLaajaalainenOsaaminen.vue';
import EpToteutussuunnitelmaKoulutuksenOsat from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsat.vue';
import EpToteutussuunnitelmaKoulutuksenOsa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue';
import EpToteutussuunnitelmaKotoOpintoSisalto from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKotoOpintoSisalto.vue';
import EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import EpToteutussuunnitelmaOsaamismerkki from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOsaamismerkki.vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';

@Component({
  components: {
    EpToteutussuunnitelmaOsaamismerkki,
    EpSpinner,
    EpToteutussuunnitelmaTekstikappale,
    EpToteutussuunnitelmaTutkinnonosa,
    EpToteutussuunnitelmaSuorituspolku,
    EpToteutussuunnitelmaOpintokokonaisuus,
    EpToteutussuunnitelmaLaajaalainenOsaaminen,
    EpToteutussuunnitelmaKoulutuksenOsat,
    EpToteutussuunnitelmaKoulutuksenOsa,
    EpToteutussuunnitelmaKotoOpintoSisalto,
    EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen,
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

      if (tutkinnonosa) {
        return {
          ...julkaistuSisalto,
          tosa: tutkinnonosa.tosa,
        };
      }
    }

    return julkaistuSisalto;
  }

  get perusteenTutkinnonOsanId() {
    return this.sisaltoviite.tosa?.vierastutkinnonosa?.tosaId || this.sisaltoviite.tosa?.perusteentutkinnonosa;
  }

  get perusteenTutkinnonosaViite() {
    return _.find(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, perusteTosaViite => _.get(perusteTosaViite, '_tutkinnonOsa') === _.toString(this.perusteenTutkinnonOsanId));
  }

  get perusteenTutkinnonosa() {
    return _.find(this.opetussuunnitelmaDataStore.perusteidenTutkinnonOsat, perusteTosaViite => _.get(perusteTosaViite, 'id') === _.toNumber(this.perusteenTutkinnonOsanId));
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

  get current(): NavigationNode | null {
    return this.opetussuunnitelmaDataStore.current;
  }

  get numerointi() {
    return this.current?.meta?.numerointi;
  }

  get alikappaleNumeroinnitById() {
    if (this.current?.children) {
      return this.current?.children?.reduce((acc: any, child: any) => {
        acc[child.id] = child?.meta?.numerointi;
        return acc;
      }, {});
    }

    return {};
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;

  }

</style>

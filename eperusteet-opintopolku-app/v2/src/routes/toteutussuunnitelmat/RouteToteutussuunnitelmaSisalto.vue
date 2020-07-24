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
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';

@Component({
  components: {
    EpSpinner,
    EpToteutussuunnitelmaTekstikappale,
    EpToteutussuunnitelmaTutkinnonosa,
    EpToteutussuunnitelmaSuorituspolku,
  },
})
export default class RouteToteutussuunnitelmaSisalto extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  private sisaltoviiteStore: SisaltoviiteStore | null = null;

  async mounted() {
    this.sisaltoviiteStore = new SisaltoviiteStore(this.opetussuunnitelmaDataStore.opetussuunnitelma!, _.toNumber(this.$route.params.sisaltoviiteId));
  }

  get fetching() {
    if (this.sisaltoviiteStore) {
      return this.sisaltoviiteStore.fetching.value;
    }
  }

  get sisaltoviite() {
    if (this.sisaltoviiteStore) {
      return this.sisaltoviiteStore.sisaltoviite.value;
    }
  }

  get perusteenTutkinnonosa() {
    if (this.sisaltoviiteStore) {
      return this.sisaltoviiteStore.perusteenTutkinnonosa.value;
    }
  }

  get perusteenTutkinnonosaViite() {
    if (this.sisaltoviiteStore) {
      return this.sisaltoviiteStore.perusteenTutkinnonosaViite.value;
    }
  }

  get opetussuunnitelma() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
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

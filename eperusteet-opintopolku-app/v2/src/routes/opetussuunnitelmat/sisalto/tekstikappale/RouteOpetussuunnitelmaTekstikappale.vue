<template>
<div class="content">
  <div v-if="istekstiKappaleAllLoaded">
    <h2 id="tekstikappale-otsikko" class="otsikko">{{ $kaanna(tekstiKappale.nimi) }}</h2>

    <!-- Perusteen teksti -->
    <ep-collapse tyyppi="perusteteksti"
                 v-if="perusteTekstikappale && perusteTekstikappale.teksti">
      <div class="collapse-header" slot="header">{{ $t('perusteen-teksti') }}</div>
      <ep-content-viewer v-if="perusteTekstikappale"
                         :value="$kaanna(perusteTekstikappale.teksti)"
                         :termit="perusteTermit"
                         :kuvat="perusteKuvat" />
    </ep-collapse>

    <!-- Pohjan teksti -->
    <ep-collapse tyyppi="pohjateksti"
                 v-if="tekstiKappaleOriginal && tekstiKappaleOriginal.teksti">
      <div class="collapse-header" slot="header">{{ $t('pohjan-teksti') }}</div>
      <ep-content-viewer v-if="tekstiKappaleOriginal" :value="$kaanna(tekstiKappaleOriginal.teksti)" :termit="termit" :kuvat="kuvat" />
    </ep-collapse>

    <!-- Opetussuunnitelman teksti -->
    <ep-collapse tyyppi="paikallinen-teksti"
                 v-if="tekstiKappale && tekstiKappale.teksti">
      <div class="collapse-header" slot="header">{{ $t('paikallinen-teksti') }}</div>
      <ep-content-viewer :value="$kaanna(tekstiKappale.teksti)" :termit="termit" :kuvat="kuvat" />
    </ep-collapse>

    <!-- Alikappaleet -->
    <div v-if="alikappaleet">
      <div v-for="(alikappaleViite, idx) in alikappaleet" :key="idx">
        <ep-heading class="aliotsikko"
                    :level="alikappaleViite.level + 2">
          {{ $kaanna(alikappaleViite.tekstiKappale.nimi) }}
        </ep-heading>

        <!-- Perusteen teksti -->
        <ep-collapse tyyppi="perusteteksti"
                     v-if="alikappaleViite.naytaPerusteenTeksti && perusteAlikappaleetObj && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId] && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId].teksti">
          <div class="collapse-header" slot="header">{{ $t('perusteen-teksti') }}</div>
          <ep-content-viewer v-if="alikappaleViite.naytaPerusteenTeksti && perusteAlikappaleetObj && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId]"
                             :value="$kaanna(perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId].teksti)"
                             :termit="perusteTermit"
                             :kuvat="perusteKuvat" />
        </ep-collapse>

        <!-- Pohjan teksti -->
        <ep-collapse tyyppi="pohjateksti"
                     v-if="alikappaleViite.naytaPohjanTeksti && originalAlikappaleetObj && originalAlikappaleetObj[alikappaleViite._original] && originalAlikappaleetObj[alikappaleViite._original].tekstiKappale && originalAlikappaleetObj[alikappaleViite._original].tekstiKappale.teksti">
          <div class="collapse-header" slot="header">{{ $t('pohjan-teksti') }}</div>
          <ep-content-viewer v-if="alikappaleViite.naytaPohjanTeksti && originalAlikappaleetObj && originalAlikappaleetObj[alikappaleViite._original] && originalAlikappaleetObj[alikappaleViite._original].tekstiKappale"
                             :value="$kaanna(originalAlikappaleetObj[alikappaleViite._original].tekstiKappale.teksti)"
                             :termit="termit"
                             :kuvat="kuvat" />
        </ep-collapse>

        <!-- Opetussuunnitelman teksti -->
        <ep-collapse tyyppi="paikallinen-teksti"
                 v-if="alikappaleViite.tekstiKappale.teksti">
          <div class="collapse-header" slot="header">{{ $t('paikallinen-teksti') }}</div>
          <ep-content-viewer :value="$kaanna(alikappaleViite.tekstiKappale.teksti)" :termit="termit" :kuvat="kuvat" />
        </ep-collapse>
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { OpetussuunnitelmaTekstikappaleStore } from '@/stores/OpetussuunnitelmaTekstikappaleStore';
import { Puu } from '@shared/api/tyypit';


@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpCollapse,
  }
})
export default class RouteOpetussuunnitelmaTekstikappale extends Vue {

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private opetussuunnitelmaTekstikappaleStore!: OpetussuunnitelmaTekstikappaleStore;

  @Watch('current', { immediate: true })
  async fetchTekstikappale() {
    if (!this.current) {
      return;
    }
    // Haetaan navigaation mukainen tekstikappale
    await this.opetussuunnitelmaTekstikappaleStore.fetchTekstikappaleAll(true);
  }

  get tekstiKappaleViite() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappaleViite;
  }

  get istekstiKappaleAllLoaded() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappaleAllLoaded;
  }

  get tekstiKappale() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappale;
  }

  get tekstiKappaleOriginalViite() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappaleOriginalViite;
  }

  get tekstiKappaleOriginal() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappaleOriginal;
  }

  get perusteTekstikappaleViite() {
    return this.opetussuunnitelmaTekstikappaleStore.perusteTekstikappaleViite;
  }

  get perusteTekstikappale() {
    if (this.perusteTekstikappaleViite) {
      return this.perusteTekstikappaleViite.perusteenOsa;
    }
  }

  get originalAlikappaleetObj() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappaleOriginalViitteetObj;
  }

  get perusteAlikappaleetObj() {
    if (!_.isEmpty(this.perusteTekstikappaleViite)) {
      const viitteet: any[] = [];
      const stack = [this.perusteTekstikappaleViite!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        if (head.perusteenOsa) {
          viitteet.push(head.perusteenOsa);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite
        })));
      }

      // Poistetaan nykyinen viite alikappaleista
      return _.keyBy(_.slice(viitteet, 1), 'id');
    }
  }

  get alikappaleet() {
    if (!_.isEmpty(this.tekstiKappaleViite)) {
      const viitteet: Puu[] = [];
      const stack: Puu[] = [this.tekstiKappaleViite!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        if (head.tekstiKappale) {
          viitteet.push(head);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite,
          level: (head.level || 0) + 1
        })));
      }

      // Poistetaan nykyinen viite alikappaleista
      return _.slice(viitteet, 1);
    }
    else {
      return [];
    }
  }

  get perusteTermit() {
    return this.opetussuunnitelmaDataStore.perusteTermit;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get perusteKuvat() {
    return this.opetussuunnitelmaDataStore.perusteKuvat;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get current() {
    return this.opetussuunnitelmaDataStore.current || null;
  }
}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  .aliotsikko {
    margin-top: 42px;
  }

  .collapse-header {
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
  }
}
</style>

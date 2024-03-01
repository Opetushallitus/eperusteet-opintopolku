<template>
<div class="content">
  <div v-if="istekstiKappaleAllLoaded">
    <h2 id="tekstikappale-otsikko" class="otsikko">{{ $kaanna(tekstiKappale.nimi) }}</h2>

    <!-- Perusteen teksti -->
    <ep-collapse tyyppi="perusteteksti"
                 v-if="tekstiKappaleViite && tekstiKappaleViite.naytaPerusteenTeksti && perusteTekstikappale && perusteTekstikappale.teksti">
      <div class="collapse-header" slot="header">{{ $t('perusteen-teksti') }}</div>
      <ep-content-viewer v-if="perusteTekstikappale"
                         :value="$kaanna(perusteTekstikappale.teksti)"
                         :termit="perusteTermit"
                         :kuvat="perusteKuvat" />
    </ep-collapse>

    <template v-if="tekstiKappaleViite && tekstiKappaleViite.naytaPerusteenTeksti && laajaAlaisetOsaamiset">
      <EpCollapse v-for="lao in laajaAlaisetOsaamiset" :key="'lao' + lao.id">
        <h3 slot="header">{{$kaanna(lao.nimi)}}</h3>
        <div v-html="$kaanna(lao.kuvaus)" />
      </EpCollapse>
    </template>

    <!-- Pohjan teksti -->
    <ep-collapse tyyppi="pohjateksti"
                 v-if="tekstiKappaleViite && tekstiKappaleViite.naytaPohjanTeksti && hasTekstikappaleOriginalsTeksteja">
      <div class="collapse-header" slot="header">
        {{ $t('pohjan-teksti') }}
        <span v-if="pohjaNimi">({{$kaanna(pohjaNimi)}})</span>
      </div>
      <ep-content-viewer v-for="(tekstiKappaleOriginal, index) in tekstiKappaleOriginals" :key="'tekstiKappaleOriginal'+index" :value="$kaanna(tekstiKappaleOriginal.teksti)" :termit="termit" :kuvat="kuvat" />
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
                     v-if="alikappaleViite.naytaPohjanTeksti && alikappaleViite.original && alikappaleViite.original.tekstiKappale && alikappaleViite.original.tekstiKappale.teksti">
          <div class="collapse-header" slot="header">{{ $t('pohjan-teksti') }}</div>
          <ep-content-viewer :value="$kaanna(alikappaleViite.original.tekstiKappale.teksti)"
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Puu } from '@shared/api/ylops';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpCollapse,
  },
})
export default class RouteOpetussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get tekstikappaleId() {
    return _.toNumber(this.$route.params.viiteId);
  }

  get tekstiKappaleViite() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.tekstikappaleId });
  }

  get tekstiKappale() {
    return this.tekstiKappaleViite.tekstiKappale;
  }

  get perusteTekstikappaleViite() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ _perusteenOsa: _.toString(this.tekstiKappaleViite.perusteTekstikappaleId) });
  }

  get perusteTekstikappale() {
    if (this.perusteTekstikappaleViite) {
      return this.perusteTekstikappaleViite.perusteenOsa;
    }
  }

  get istekstiKappaleAllLoaded() {
    return !!this.tekstiKappaleViite;
  }

  get tekstiKappaleOriginals() {
    return _.map([
      ...(this.tekstiKappaleViite.original ? [this.tekstiKappaleViite.original] : []),
      ...(this.tekstiKappaleViite.original && this.tekstiKappaleViite.original.original && this.tekstiKappaleViite.original.naytaPohjanTeksti ? [this.tekstiKappaleViite.original.original] : []),
    ], 'tekstiKappale');
  }

  get hasTekstikappaleOriginalsTeksteja() {
    return _.size(_.filter(this.tekstiKappaleOriginals, 'teksti')) > 0;
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
          ...viite,
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
          level: (head.level || 0) + 1,
        })));
      }

      // Poistetaan nykyinen viite alikappaleista
      return _.slice(_.reject(viitteet, 'piilotettu'), 1);
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

  get pohjaNimi() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma?.pohja?.nimi;
  }

  get laajaAlaisetOsaamiset() {
    if (this.perusteTekstikappale?.tunniste === 'laajaalainenosaaminen') {
      return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('aipe.laajaalaisetosaamiset');
    }
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

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

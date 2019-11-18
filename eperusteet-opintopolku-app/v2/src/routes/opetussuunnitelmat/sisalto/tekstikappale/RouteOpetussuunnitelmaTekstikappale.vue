<template>
<div class="content">
  <ep-spinner v-if="isLoading" />
  <div v-else>
    <h2 id="tekstikappale-otsikko" class="otsikko">{{ $kaanna(tekstiKappale.nimi) }}</h2>

    <!-- Perusteen teksti -->
    <ep-content-viewer v-if="perusteTekstikappale" :value="$kaanna(perusteTekstikappale.teksti)" :termit="termit" :kuvat="kuvat" />

    <!-- Pohjan teksti -->
    <ep-content-viewer v-if="tekstiKappaleOriginal" :value="$kaanna(tekstiKappaleOriginal.teksti)" :termit="termit" :kuvat="kuvat" />

    <!-- Opetussuunnitelman teksti -->
    <ep-content-viewer :value="$kaanna(tekstiKappale.teksti)" :termit="termit" :kuvat="kuvat" />


    <!-- Alikappaleet -->
    <div v-for="(alikappaleViite, idx) in alikappaleet" :key="idx">
      <ep-heading class="otsikko"
                  :level="alikappaleViite.level + 2">
        {{ $kaanna(alikappaleViite.tekstiKappale.nimi) }}
      </ep-heading>

      <!-- Perusteen teksti -->
      <ep-content-viewer v-if="perusteAlikappaleetObj && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId]"
                         :value="$kaanna(perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId].teksti)"
                         :termit="termit"
                         :kuvat="kuvat" />

      <!-- Pohjan teksti -->
      <ep-content-viewer v-if="originalAlikappaleetObj && originalAlikappaleetObj[alikappaleViite._original] && originalAlikappaleetObj[alikappaleViite._original].tekstiKappale"
                         :value="$kaanna(originalAlikappaleetObj[alikappaleViite._original].tekstiKappale.teksti)"
                         :termit="termit"
                         :kuvat="kuvat" />

      <!-- Opetussuunnitelman teksti -->
      <ep-content-viewer :value="$kaanna(alikappaleViite.tekstiKappale.teksti)" :termit="termit" :kuvat="kuvat" />
    </div>

    <slot name="previous-next-navigation" />
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { OpetussuunnitelmaTekstikappaleStore } from '@/stores/OpetussuunnitelmaTekstikappaleStore';
import { TekstiKappaleViiteKevytDto } from '@shared/api/tyypit';


@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
  }
})
export default class RouteOpetussuunnitelmaTekstikappale extends Vue {

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private opetussuunnitelmaTekstikappaleStore!: OpetussuunnitelmaTekstikappaleStore;

  private isLoading = true;

  async mounted() {
    await this.opetussuunnitelmaTekstikappaleStore.fetchTekstikappale(true);
    await this.opetussuunnitelmaTekstikappaleStore.fetchOriginalTekstikappale();
    await this.opetussuunnitelmaTekstikappaleStore.fetchPerusteTekstikappale();
    this.isLoading = false;
  }

  get tekstiKappaleViite() {
    return this.opetussuunnitelmaTekstikappaleStore.tekstiKappaleViite;
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
      const viitteet: TekstiKappaleViiteKevytDto[] = [];
      const stack: TekstiKappaleViiteKevytDto[] = [this.tekstiKappaleViite!];

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

  get termit() {
    return null;
  }

  get kuvat() {
    return null;
  }
}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

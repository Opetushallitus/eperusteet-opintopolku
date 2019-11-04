<template>
<div class="content">
  <div v-if="perusteenOsa">
    <h2 id="tekstikappale-otsikko" class="otsikko">{{ $kaanna(perusteenOsa.nimi) }}</h2>
    <div class="teksti" v-html="$kaanna(perusteenOsa.teksti)"></div>

    <!-- Alikappaleet -->
    <div v-for="(alikappaleViite, idx) in alikappaleet" :key="idx">
      <ep-heading class="otsikko"
                  :level="alikappaleViite.level + 2">
        {{ $kaanna(alikappaleViite.perusteenOsa.nimi) }}
      </ep-heading>
      <div class="teksti" v-html="$kaanna(alikappaleViite.perusteenOsa.teksti)"></div>
    </div>

    <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { ViiteLaaja } from '@shared/api/tyypit';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';


@Component({
  components: {
    EpPreviousNextNavigation,
    EpSpinner,
    EpHeading,
  }
})
export default class RouteTekstikappale extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Watch('current', { immediate: true })
  async fetchAlikappaleet() {
    if (!this.current) {
      return;
    }

    const isMainHeading = !!this.current && this.current.path.length === 2;
    await this.perusteenOsaStore.fetchPerusteenOsa(isMainHeading);
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get perusteenOsaViite() {
    return this.perusteenOsaStore.perusteenOsaViite;
  }

  get alikappaleet(): any[] {
    if (!_.isEmpty(this.perusteenOsaViite)) {
      const viitteet: ViiteLaaja[] = [];

      const stack: ViiteLaaja[] = [this.perusteenOsaViite!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        if (head.perusteenOsa) {
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

  get flattenedSidenav() {
    return this.perusteDataStore.flattenedSidenav;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';
@import '../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>

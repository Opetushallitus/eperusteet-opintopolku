<template>
  <div v-if="!muokkaustieto.poistettu && location">
    <router-link :to="location">
      <span v-if="muokkaustieto.nimi">{{ $kaanna(muokkaustieto.nimi) }}</span>
      <span v-else>{{ $t('kohteen-nimea-ei-saatavilla') }}</span>
    </router-link>
  </div>
  <div v-else>
    {{ $kaanna(muokkaustieto.nimi) }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NavigationNodeDto } from '@shared/tyypit';
import { NavigationNode, setPerusteData } from '@shared/utils/NavigationBuilder';

@Component({
  components: {
  },
})
export default class EpRouterLink extends Vue {
  @Prop({ required: true })
  private muokkaustieto!: any;

  get location() {
    let node: NavigationNode = {
      type: this.muokkaustieto.kohde,
      children: [],
      path: [],
      location: undefined,
    };
    let navNode: NavigationNodeDto = {
      id: this.muokkaustieto.kohdeId,
      type: this.muokkaustieto.kohde,
      meta: { oppiaine: this.muokkaustieto.lisatieto },
    };
    setPerusteData(node, navNode);
    return node.location;
  }
}
</script>

<style scoped lang="scss">

</style>

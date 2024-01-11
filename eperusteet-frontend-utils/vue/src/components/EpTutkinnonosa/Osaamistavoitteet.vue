<template>
  <div>
    <ep-collapse :borderBottom="true">
      <h3 slot="header">{{ nimi }}</h3>
      <EpAmmattitaitovaatimukset
        v-if="perusteenOsaamistavoite"
        tavoitekoodisto="osaamistavoitteet"
        :value="perusteenOsaamistavoite.tavoitteet"
        :is-editing="false" />
    </ep-collapse>

    <ep-collapse :borderBottom="true" :collapsable="!isEditing" :class="{'pt-0 pb-0': isEditing}">
      <h3 slot="header" v-if="!isEditing">{{ $t('arviointi') }}</h3>
      <div v-if="perusteData">
        <GeneerinenArviointiTaulukko v-if="perusteData.geneerinenArviointiasteikko"
                                     :arviointi="perusteData.geneerinenArviointiasteikko" />
        <Arviointi2020Taulukko v-else-if="perusteData.tyyppi === 'osaalue2020' && perusteData.arviointi"
                                     :arviointi="perusteData.arviointi" />
      </div>
      <div class="alert alert-warning" v-else>
        {{ $t('perusteella-virheellinen-arviointi') }}
      </div>
    </ep-collapse>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpEditointi from '@shared/components/EpEditointi/EpEditointi.vue';
import GeneerinenArviointiTaulukko from '@shared/components/EpTutkinnonosa/GeneerinenArviointiTaulukko.vue';
import Arviointi2020Taulukko from '@shared/components/EpTutkinnonosa/Arviointi2020Taulukko.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';

@Component({
  components: {
    Arviointi2020Taulukko,
    EpAmmattitaitovaatimukset,
    EpButton,
    EpCollapse,
    EpContent,
    EpEditointi,
    EpField,
    EpToggle,
    GeneerinenArviointiTaulukko,
  },
})
export default class Osaamistavoitteet extends Vue {
  @Prop({ required: false, default: false })
  isEditing!: boolean;

  @Prop({ required: true })
  tyyppi!: any;

  @Prop({ default: null })
  perusteData!: any;

  get nimi() {
    const nimi = this.tyyppi === 'pakollinen'
      ? this.$t('pakolliset-osaamistavoitteet')
      : this.$t('valinnaiset-osaamistavoitteet');
    if (this.perusteenOsaamistavoite?.laajuus) {
      const laajuusosa = ', ' + this.perusteenOsaamistavoite.laajuus + ' ' + this.$t('osaamispistetta');
      return nimi + laajuusosa;
    }
    else {
      return nimi;
    }
  }

  get perusteenOsaamistavoite() {
    if (this.perusteData) {
      if (this.tyyppi === 'pakollinen') {
        return this.perusteData.pakollisetOsaamistavoitteet;
      }
      else if (this.tyyppi === 'valinnainen') {
        return this.perusteData.valinnaisetOsaamistavoitteet;
      }
    }
    return null;
  }
}

</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";
@import '@shared/styles/_mixins.scss';
</style>

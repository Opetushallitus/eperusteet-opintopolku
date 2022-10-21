<template>
  <div class="content">
    <ep-spinner v-if="!tutkinnonosa"></ep-spinner>
    <div v-else>
      <h2 class="otsikko mb-4" slot="header">{{ $kaanna(tutkinnonosa.nimi)}}{{laajuusText}}</h2>

      <ep-tutkinnonosa-normaali v-if="tutkinnonosa.tyyppi === 'normaali'" :tutkinnonosa="tutkinnonosa" :arviointiasteikot="arviointiasteikot" />
      <ep-tutkinnonosa-tutke v-else :tutkinnonosa="tutkinnonosa" :arviointiasteikot="arviointiasteikot" :perusteenKielet="perusteenKielet"/>

      <EpOpasKiinnitysLinkki v-if="tutkinnonosaKoodiUri" :koodiUri="tutkinnonosaKoodiUri"/>

    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component({
  components: {
    EpSpinner,
    EpTutkinnonosaNormaali,
    EpTutkinnonosaTutke,
    EpOpasKiinnitysLinkki,
  },
})
export default class RouteTutkinnonosa extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get tutkinnonosaViiteId() {
    return _.toNumber(this.$route.params.tutkinnonOsaViiteId);
  }

  get tutkinnonosaViite() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.tutkinnonosaViiteId }) as any;
  }

  get perusteenTutkinnonosa() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: _.toNumber(_.get(this.tutkinnonosaViite, '_tutkinnonOsa')) }) as any;
  }

  get laajuus() {
    if (_.isNumber(this.tutkinnonosaViite.laajuus) && _.isNumber(this.tutkinnonosaViite.laajuusMaksimi)) {
      return this.tutkinnonosaViite.laajuus + ' - ' + this.tutkinnonosaViite.laajuusMaksimi;
    }

    return this.tutkinnonosaViite.laajuus;
  }

  get laajuusText() {
    if (!this.tutkinnonosaViite.laajuus) {
      return '';
    }
    return ', ' + this.laajuus + ' ' + this.$t('osaamispiste');
  }

  get arviointiasteikot() {
    return this.perusteDataStore.arviointiasteikot;
  }

  get tutkinnonosaKoodiUri() {
    return this.tutkinnonosa?.koodi?.uri;
  }

  get perusteenKielet() {
    return this.perusteDataStore.peruste?.kielet;
  }

  get tutkinnonosa() {
    let tutkinnonosa = _.cloneDeep(this.perusteenTutkinnonosa);

    if (_.get(tutkinnonosa, 'geneerinenArviointiasteikko') && !!_.get(tutkinnonosa.geneerinenArviointiasteikko, '_arviointiAsteikko')) {
      const arviointiAsteikko = _.keyBy(this.arviointiasteikot, 'id')[_.get(tutkinnonosa.geneerinenArviointiasteikko, '_arviointiAsteikko')];
      const osaamistasot = _.keyBy(arviointiAsteikko.osaamistasot, 'id');
      tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit = _.map(tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit, otKriteeri => {
        return {
          ...otKriteeri,
          osaamistaso: osaamistasot[_.get(otKriteeri, '_osaamistaso')],
        };
      });
    }

    return tutkinnonosa;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>

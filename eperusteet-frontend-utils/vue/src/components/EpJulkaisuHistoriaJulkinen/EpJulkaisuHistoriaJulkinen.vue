<template>
  <div class="julkaisuhistoria mt-4">
    <EpSpinner v-if="!julkaisut"/>
    <template v-else>
      <div class="alert alert-info" v-if="julkaisut.length === 0">
        <slot name="empty">{{ $t('ei-julkaisuja') }}</slot>
      </div>
      <div v-else>
        <EpJulkaisuLista :julkaisut="julkaisutMapped.slice(0,2)"
                         :latest-julkaisu-revision="latestJulkaisuRevision">
        </EpJulkaisuLista>
        <EpCollapse v-if="julkaisut.length > 2"
                    :borderBottom="false"
                    class="mt-4"
                    :expandedByDefault="false"
                    :chevronLocation="'left'"
                    :use-padding="false">
          <template v-slot:header="{ toggled }">
            <template v-if="!toggled">{{$t('nayta-lisaa')}}</template>
            <template v-if="toggled">{{$t('nayta-vahemman')}}</template>
          </template>
          <EpJulkaisuLista :julkaisut="julkaisutMapped.slice(2)"
                           :latest-julkaisu-revision="latestJulkaisuRevision">
          </EpJulkaisuLista>
        </EpCollapse>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpJulkaisuLista from '@shared//components/EpJulkaisuHistoriaJulkinen/EpJulkaisuLista.vue';

interface Julkaisu {
  muutosmaaraysVoimaan?: Date;
  revision?: number;
  julkinenTiedote?: { [key: string]: string; };
  luotu?: Date;
  tila?: 'JULKAISTU' | 'KESKEN' | 'VIRHE';
  liitteet?: any;
}

@Component({
  components: {
    EpJulkaisuLista,
    EpButton,
    EpSpinner,
    EpCollapse,
  },
})
export default class EpJulkaisuHistoriaJulkinen extends Vue {
  @Prop({ required: false })
  private julkaisut!: Julkaisu[];

  get julkaisutMapped() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          tila: julkaisu.tila || 'JULKAISTU',
          liitteet: this.muutosmaaraysLiite(julkaisu),
        };
      })
      .sortBy('revision')
      .reverse()
      .value();
  }

  get latestJulkaisuRevision() {
    return _.find(this.julkaisutMapped, julkaisu => julkaisu.tila === 'JULKAISTU');
  }

  muutosmaaraysLiite(julkaisu) {
    if (julkaisu.liitteet && julkaisu.liitteet.length > 0) {
      julkaisu.liitteet.forEach(liiteData => {
        liiteData.url = `/eperusteet-service/api/perusteet/${julkaisu.peruste.id!}/julkaisu/liitteet/${liiteData.liite.id}`;
      });
      return julkaisu.liitteet;
    }
    else {
      return [];
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

::v-deep .ep-collapse .header {
  color: #3367E3;
}

</style>

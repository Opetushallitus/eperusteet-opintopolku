<template>
  <div class="julkaisuhistoria">
    <h3 slot="header">{{ $t('julkaisuhistoria') }}</h3>
    <EpSpinner v-if="!julkaisut"/>
    <template v-else>
      <div class="alert alert-info" v-if="julkaisut.length === 0">
        <slot name="empty">{{ $t('ei-julkaisuja') }}</slot>
      </div>
      <div v-else>
        <div v-for="(julkaisu, index) in julkaisutMapped" :key="'julkaisu'+index" class="julkaisu pb-2 ml-1 px-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="font-weight-bold pr-1">{{$t('julkaisu')}} {{julkaisu.revision}}</span>
              <span v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision === julkaisu.revision" class="julkaistu">{{$t('julkaistu-versio')}}</span>
              <span v-if ="julkaisu.tila === 'KESKEN'" class="julkaistu julkaistu--kesken">{{$t('julkaisu-kesken')}}</span>
              <span v-if ="julkaisu.tila === 'VIRHE'" class="julkaistu julkaistu--virhe">{{$t('julkaisu-epaonnistui')}}</span>
            </div>

            <div class="d-flex align-items-center">
              <slot name="katsele" :julkaisu="julkaisu" v-if="julkaisu.tila !== 'VIRHE'"></slot>
              <EpButton v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision !== julkaisu.revision && julkaisu.tila === 'JULKAISTU'"
                        icon="keyboard_return"
                        class="ml-4"
                        variant="link"
                        :showSpinner="julkaisu.palautuksessa"
                        @click="palautaConfirm(julkaisu)"
                        v-oikeustarkastelu="{ oikeus: 'muokkaus' }">
                {{ $t('palauta') }}
              </EpButton>
            </div>
          </div>
          <div class="my-1">{{$sdt(julkaisu.luotu)}} <span v-if="julkaisu.nimi">{{julkaisu.nimi}}</span></div>
          <div class="my-1" v-html="$kaanna(julkaisu.tiedote)"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

interface Julkaisu {
  revision?: number;
  tiedote?: { [key: string]: string; };
  luotu?: Date;
  luoja?: string;
  kayttajanTieto?: any;
  tila?: 'JULKAISTU' | 'KESKEN' | 'VIRHE';
}

@Component({
  components: {
    EpButton,
    EpSpinner,
    EpMaterialIcon,
  },
})
export default class EpJulkaisuHistoria extends Vue {
  @Prop({ required: false })
  private julkaisut!: Julkaisu[];

  @Prop({ required: false })
  private palauta!: Function;

  private palautuksessa: any | null = null;

  get julkaisutMapped() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          ...(julkaisu.kayttajanTieto && { nimi: parsiEsitysnimi(julkaisu.kayttajanTieto) }),
          tila: julkaisu.tila || 'JULKAISTU',
          palautuksessa: this.palautuksessa === julkaisu.revision,
        };
      })
      .sortBy('revision')
      .reverse()
      .value();
  }

  get latestJulkaisuRevision() {
    return _.find(this.julkaisutMapped, julkaisu => julkaisu.tila === 'JULKAISTU');
  }

  async palautaConfirm(julkaisu) {
    if (await this.$bvModal.msgBoxConfirm((this.$t('toiminto-kopioi-ja-palauttaa-valitsemasi-version-julkiseksi') as any), {
      title: this.$t('palauta-versio-julkiseksi'),
      okVariant: 'primary',
      okTitle: this.$t('kylla') as any,
      cancelVariant: 'link',
      cancelTitle: this.$t('peruuta') as any,
      centered: true,
      ...{} as any,
    })) {
      this.palautuksessa = julkaisu.revision;
      await this.palauta(julkaisu);
      this.palautuksessa = null;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';
.julkaisu:nth-of-type(even) {
  background-color: $gray-lighten-13;
}

.julkaistu {
  border-radius: 25px;
  background-color: $green-lighten-2;
  padding: 5px 10px;
  margin-left: 10px;
  color: $white;

  &--kesken {
    background-color: $yellow-1;
  }

  &--virhe {
    background-color: $red-lighten-1;
  }
}

</style>

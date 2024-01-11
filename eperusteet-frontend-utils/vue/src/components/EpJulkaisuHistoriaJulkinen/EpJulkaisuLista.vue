<template>
  <div class="mt-2">
    <div v-for="(julkaisu, index) in julkaisutFiltered" :key="'julkaisu'+index" class="julkaisu pb-2 pt-2 ml-1 px-3">
      <div class="d-flex">
        <span class="font-bold font-size pr-3">{{$t('julkaisu')}} {{ $sd(julkaisu.luotu) }}</span>
        <span v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision === julkaisu.revision" class="julkaistu">{{$t('uusin')}}</span>
        <router-link v-if="latestJulkaisuRevision && latestJulkaisuRevision.revision !== julkaisu.revision && versio !== julkaisu.revision"
                     :to="{ name: 'perusteTiedot', params: { perusteId: julkaisu.peruste.id, revision: julkaisu.revision } }">
          {{ $t('siirry-julkaisuun') }}
        </router-link>
        <span v-if="versio === julkaisu.revision" class="font-italic">{{ $t('katselet-tata-julkaisua') }}</span>
      </div>
      <div v-if="julkaisu.muutosmaaraysVoimaan && julkaisu.liitteet && julkaisu.liitteet.length > 0" class="mt-2">
        <div v-for="(liiteData, index) in julkaisu.liitteet" :key="'maarays'+index" class="maarayslinkit">
          <a :href="liiteData.url"
             target="_blank"
             rel="noopener noreferrer">{{ liiteData.nimi }}</a>
        </div>
        <span>- {{ $t('voimassaolo-alkaa') }} {{ $sd(julkaisu.muutosmaaraysVoimaan) }}</span>
      </div>
      <div v-if="julkaisu.muutosmaarays" class="d-flex mt-2">
        <EpPdfLink :url="julkaisu.muutosmaarays.url">{{ $kaanna(julkaisu.muutosmaarays.nimi) }}</EpPdfLink>
        <span class="pl-2"> - {{$t('voimassaolo-alkaa')}} {{$sd(julkaisu.muutosmaarays.voimassaoloAlkaa)}}</span>
      </div>
      <div v-if="julkaisu.julkinenTiedote" class="my-1" v-html="$kaanna(julkaisu.julkinenTiedote)"></div>
      <EpCollapse :borderBottom="false"
                  :expandedByDefault="false"
                  :chevronLocation="'right'"
                  :use-padding="false">
        <template v-slot:header="{ toggled }">
          <template v-if="!toggled">{{$t('nayta-muutokset')}}</template>
          <template v-if="toggled">{{$t('piilota-muutokset')}}</template>
        </template>
        <EpMuutosvertailu :julkaisu="julkaisu"></EpMuutosvertailu>
      </EpCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpMuutosvertailu from '@shared//components/EpJulkaisuHistoriaJulkinen/EpMuutosvertailu.vue';
import { MaaraysLiiteDtoTyyppiEnum } from '@shared/generated/eperusteet';
import { MaarayksetParams, baseURL } from '@shared/api/eperusteet';

@Component({
  components: {
    EpCollapse,
    EpMuutosvertailu,
  },
})
export default class EpJulkaisuLista extends Vue {
  @Prop({ required: true })
  private julkaisut!: any[];

  @Prop({ required: true })
  private latestJulkaisuRevision!: any;

  get julkaisutFiltered() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          ...julkaisu,
          liitteet: _.filter(julkaisu.liitteet, liite => liite.kieli === Kielet.getSisaltoKieli.value),
          ...(!!julkaisu.muutosmaarays && {
            muutosmaarays: {
              ...julkaisu.muutosmaarays,
              url: this.muutosmaaraysUrl(julkaisu.muutosmaarays),
            },
          }),
        };
      })
      .value();
  }

  muutosmaaraysUrl(muutosmaarays) {
    if (!_.find(muutosmaarays.liitteet![this.$slang.value].liitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI)) {
      return null;
    }

    return baseURL + MaarayksetParams.getMaaraysLiite(_.toString(_.get(_.find(muutosmaarays.liitteet![this.$slang.value].liitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI), 'id'))).url;
  }

  get versio() {
    return _.toNumber(this.$route.params?.revision);
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
  background-color: $green-1;
  padding: 1px 10px;
  margin-left: 10px;
  color: $black;

  &--kesken {
    background-color: $yellow-1;
  }

  &--virhe {
    background-color: $red-lighten-1;
  }
}

.font-bold {
  font-weight: 600 !important;
}

.font-size {
  font-size: 110%;
}

.julkinen {
  color: $green;
}

.maarayslinkit {
  display: inline;
  padding-right: 5px;
}

::v-deep .ml-auto {
  margin-left: 0 !important;
}

::v-deep .ep-collapse {
  overflow: auto;
}

::v-deep .ep-collapse .header {
  margin-left: auto !important;
  margin-right: 5px;
}
</style>

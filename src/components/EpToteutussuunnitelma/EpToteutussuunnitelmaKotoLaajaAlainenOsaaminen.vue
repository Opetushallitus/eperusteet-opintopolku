<template>
  <div v-if="perusteenOsa">
    <h2 id="tekstikappale-otsikko" class="otsikko mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>

      <div class="mb-4">
        <ep-content-viewer :value="$kaanna(perusteenOsa.yleiskuvaus)" :kuvat="kuvat" />
      </div>

      <b-row v-if="perusteenOsa.osaamisAlueet.length > 0" class="mt-4">
        <b-col>
          <div v-for="(osaamisalue, index) in perusteenOsa.osaamisAlueet"
               :key="index+'kotoLaajaAlainenOsaaminen'">
            <h3 class="mt-4">{{ $kaanna(osaamisalue.koodi.nimi) }}</h3>
            <ep-content-viewer :value="$kaanna(osaamisalue.kuvaus)"></ep-content-viewer>
          </div>
        </b-col>
      </b-row>

      <h3 class="mt-4">{{$t('laaja-alaisen-osaamisen-paikallinen-tarkennus')}}</h3>
      <ep-content-viewer :value="$kaanna(sisaltoviite.kotoLaajaAlainenOsaaminen.teksti)" :kuvat="kuvat" />
  </div>
</template>

<script lang="ts">
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpContentViewer,
  },
})
export default class EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: SisaltoViiteExportDto;

  @Prop({ required: true })
  private kuvat!: any[];

  get perusteenOsa() {
    return this.sisaltoviite.kotoLaajaAlainenOsaaminen?.perusteenOsa;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>

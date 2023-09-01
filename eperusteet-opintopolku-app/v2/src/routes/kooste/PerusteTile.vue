<template>
  <div class="peruste tile-background-shadow-selected shadow-tile d-flex flex-column" >
    <div class="upper">
      <div class="peruste-ikoni" :style="imgStyle">
        <ep-hallitus-img class="img"/>
      </div>
      <div class="nimi">
        {{ $kaanna(julkaisu.nimi) }} <span v-if="julkaisu.laajuus">{{julkaisu.laajuus}} {{$t('osaamispiste')}}</span>
      </div>
    </div>
    <div class="mt-auto">
      <div class="voimaantulo">
        <span v-if="julkaisu.voimassaoloAlkaa">
          {{ $t('voimaantulo') }}: {{ $sd(julkaisu.voimassaoloAlkaa) }}
        </span>
        <span v-if="eraantynyt" class="ml-3">
          <EpColorIndicator :size="10" background-color="#FF5000" :tooltip="false" kind=""/>
          {{ $t('ei-voimassa') }}
        </span>
        <span v-else class="ml-3">
          <EpColorIndicator :size="10" background-color="#57bb1a" :tooltip="false" kind=""/>
          {{ $t('voimassa') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { koulutustyyppiThemeColor, rgb2string } from '@shared/utils/perusteet';
import EpHallitusImg from '@shared/components/EpImage/EpHallitusImg.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';

interface PerusteJulkiData {
  nimi:{ [key: string]: string; };
  voimassaoloAlkaa?: number,
  voimassaoloLoppuu?: number,
  laajuus?: number,
}

@Component({
  components: {
    EpColorIndicator,
    EpHallitusImg,
  },
})
export default class PerusteTile extends Vue {
  @Prop({ required: true })
  private julkaisu!: PerusteJulkiData;

  @Prop({ required: false, type: String })
  private koulutustyyppi!: string;

  get imgStyle() {
    return 'fill: ' + rgb2string(koulutustyyppiThemeColor(this.koulutustyyppi));
  }

  get eraantynyt() {
    return this.julkaisu.voimassaoloLoppuu && Date.now() > this.julkaisu.voimassaoloLoppuu;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.peruste {
  cursor: pointer;
  margin: 10px 20px 10px 0;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  min-height: 200px;
  overflow-x: auto;
  width: 330px;
  height: 172px;
  padding-left: 20px;
  padding-right: 20px;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.voimaantulo {
  border-top: 1px solid #EBEBEB;
  color: #001A58;
  font-size: 14px;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.upper {
  height: 180px;
  overflow-y: clip;

  .peruste-ikoni {
    color: #0041DC;
    text-align: center;

    .img {
      margin: 15px;
      height: 32px;
      width: 32px;
    }
  }

  .nimi {
    hyphens: auto;
    overflow: hidden;
    width: 100%;
    padding: 0;
    text-align: center;
    color: #2B2B2B;
    font-weight: 600;
  }
}

.row {
  margin-bottom: 3rem;
}

</style>

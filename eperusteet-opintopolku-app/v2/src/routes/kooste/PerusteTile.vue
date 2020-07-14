<template>
  <div class="peruste tile-background-shadow-selected shadow-tile" >
    <div class="upper">
      <div class="peruste-ikoni" :style="imgStyle">
        <ep-hallitus-img class="img"/>
      </div>
      <div class="nimi">
        <fas fixed-width icon="external-link-alt" class="mr-1" v-if="peruste.ulkoinenlinkki"></fas>
          {{ $kaanna(peruste.nimi) }}
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-end">
      <div class="voimaantulo">
        <span v-if="peruste.voimassaoloAlkaa">
          {{ $t('voimaantulo') }}: {{ $sd(peruste.voimassaoloAlkaa) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteDto } from '@shared/api/eperusteet';
import { koulutustyyppiThemeColor, rgb2string } from '@shared/utils/perusteet';
import EpHallitusImg from '@shared/components/EpImage/EpHallitusImg.vue';

@Component({
  components: {
    EpHallitusImg,
  },
})
export default class PerusteTile extends Vue {
  @Prop({ required: true })
  private peruste!: PerusteDto;

  @Prop({ required: false, type: String })
  private koulutustyyppi!: string;

  get imgStyle() {
    return 'fill: ' + rgb2string(koulutustyyppiThemeColor(this.koulutustyyppi));
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.peruste {
  cursor: pointer;
  margin: 5px;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  min-height: 230px;
  overflow-x: auto;
  width: 343px;
  height: 172px;

  @media(max-width: 991.98px) {
    width: calc(1 / 2 * 100% - (1 - 1 / 2) * 20px);
  }

  @media(max-width: 735.98px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

}

.voimaantulo {
  border-top: 1px solid #EBEBEB;
  color: #001A58;
  font-size: smaller;
  // height: 40px;
  padding-top: 4px;
  text-align: center;
  width: 100%;
  margin: 0px 20px;
}

.upper {
  height: 180px;

  .peruste-ikoni {
    color: #0041DC;
    text-align: center;

    .img {
      margin: 20px;
      height: 32px;
      width: 32px;
    }
  }

  .nimi {
    hyphens: auto;
    overflow: hidden;
    width: 100%;
    padding: 12px;
    padding-top: 0;
    text-align: center;
    color: #2B2B2B
  }
}

.row {
  margin-bottom: 3rem;
}

</style>

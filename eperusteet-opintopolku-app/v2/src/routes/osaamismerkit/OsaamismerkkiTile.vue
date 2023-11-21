<template>
  <div class="tile tile-background-shadow-selected shadow-tile d-flex flex-column">
    <div class="ikoni">
      <EpMaterialIcon class="img" :color="rgbColor" size="46px">star</EpMaterialIcon>
    </div>
    <div class="nimi">
      {{ $t('kansalliset-perustaitojen-osaamismerkit')}}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { koulutustyyppiThemeColor, rgb2string } from '@shared/utils/perusteet';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class OsaamismerkkiTile extends Vue {
  @Prop({ required: true, type: String })
  private koulutustyyppi!: string;

  get rgbColor() {
    return rgb2string(koulutustyyppiThemeColor(this.koulutustyyppi));
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tile {
  cursor: pointer;
  margin: 10px 20px 10px 0;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  min-height: 200px;
  overflow-x: auto;
  width: 330px;
  height: 172px;
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.ikoni {
  text-align: center;
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

.img {
  margin: 15px;
  height: 46px;
  width: 46px;
}
</style>

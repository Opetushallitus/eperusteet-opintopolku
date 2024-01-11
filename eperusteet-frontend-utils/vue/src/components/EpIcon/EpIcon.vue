<template>
<div class="icon">
  <slot name="fas">
    <EpMaterialIcon class="inner" icon-shape="outlined" :background="actualBackground" :color="color" size="40px">{{ icon }}</EpMaterialIcon>
  </slot>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const ColorMap: any = {
  'arkisto': '#3367E3',
  'luo-uusi': '#3367E3',
  'opetussuunnitelmasi': '#3367E3',
  'tiedotteet': '#000000',
  'tyoryhma': '#3367E3',
  'ukk': '#3367E3',
  'valtakunnalliset-perusteet': '#3367E3',
};

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpIcon extends Vue {
  @Prop({ required: true })
  private icon!: string;

  @Prop({ default: '#ffffff' })
  private color!: string;

  @Prop({ default: '' })
  private backgroundColor!: string;

  get actualBackground(): string {
    return this.backgroundColor || ColorMap[this.icon] as string || '#3367E3';
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 74px;
  height: 74px;
  border-radius: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  vertical-align: middle;

  .inner {
    padding-top: 16px;
  }
}
</style>

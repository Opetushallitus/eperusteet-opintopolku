<template>
  <div class="d-flex justify-content-center">
    <div class="text-left" v-if="kohde">
      <div class="my-5">
        <h2>{{$t('sivua-ei-loytynyt')}}</h2>
        <div>{{$t(kohde+'-esikatselu-ei-mahdollista')}}</div>
      </div>
      <img :src="virhe.img" :alt="$t(virhe.alt)" />
    </div>
    <img v-else :src="virhe.img" :alt="$t(virhe.alt)" />
  </div>

</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import eiLoydyImage from '@assets/img/images/404.svg';
import virheImage from '@assets/img/images/virhe.png';

@Component({
  components: {
  },
})
export default class Virhe extends Vue {
  @Prop({ required: false, default: '404' })
  private virhekoodi!:string;

  @Prop({ required: false })
  private kohdeUrl!:string;

  get virhe() {
    return this.virheImage[this.virhekoodi] || this.virheImage['500'];
  }

  get kohde() {
    if (this.kohdeUrl && this.virhekoodi === '401') {
      if (_.includes(this.kohdeUrl, 'peruste')) {
        return 'peruste';
      }

      if (_.includes(this.kohdeUrl, 'opetussuunnitelma')) {
        return 'opetussuunnitelma';
      }
    }
  }

  get virheImage() {
    return {
      '500': {
        img: virheImage,
        alt: 'virhe-palvelu-virhe',
      },
      '401': {
        img: eiLoydyImage,
        alt: 'virhe-sivua-ei-loytynyt',
      },
      '404': {
        img: eiLoydyImage,
        alt: 'virhe-sivua-ei-loytynyt',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

</style>

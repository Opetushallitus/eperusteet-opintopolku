<template>
  <div class="container my-5">
    <div class="text-left">
      <div class="my-5">
        <h2>{{ $t('virhe-nakyma-otsikko') }}</h2>
        <h3>{{ $t(virhe.alt) }}</h3>
        <div v-if="kohde">{{ $t(kohde + '-esikatselu-ei-mahdollista') }}</div>
      </div>
      <div class="virhekuva">
        <img :src="virhe.img" :alt="$t(virhe.alt)" />
      </div>
      <div class="d-flex flex-row-reverse">
        <div class="align-self-center">
          <router-link :to="paluuroute">{{ $t('palaa-etusivulle') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import eiLoydyImage from '@assets/img/images/404.svg';
import virhekuva from '@assets/img/images/virhe.png';

@Component
export default class EpErrorPage extends Vue {
  @Prop({ required: false, default: '404' })
  private virhekoodi?: string;

  @Prop({ required: false })
  private kohdeUrl?: string;

  @Prop({ required: false, default: 'root' })
  private paluukohde?: string;

  mounted() {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    meta.setAttribute('content', 'noindex');
    document.head.appendChild(meta);
  }

  get virhe() {
    return (this.virhekoodi && this.virheImage[this.virhekoodi]) || this.virheImage['500'];
  }

  get paluuroute() {
    return { name: this.paluukohde };
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
        img: virhekuva,
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
@import "@shared/styles/_variables.scss";

.virhekuva {
  img {
    width: 100%;
  }
  padding: 0 10% 0 10%;
}
</style>

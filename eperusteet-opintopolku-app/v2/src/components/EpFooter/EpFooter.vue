<template>
  <footer>

    <div class="horizontal-line">
      <a :href="$kaanna(linkit.oph)">
        <img :src="ophLogo" :alt="$t('oph')" />
      </a>
    </div>

    <div class="footer-content">
      <div class="row justify-content-around">
        <div class="col-lg-2 col-md-6 col-sm-12 mb-5">
          <a :href="$kaanna(linkit.opintopolku)">
            <img class="opintopolku" :src="opintopolkuLogo" :alt="$t('opintopolku')" />
          </a>
        </div>
        <div class="col-lg-2 col-md-6 col-sm-12 mb-5">
          <span class="font-weight-bold">{{ $t('eperusteet-virkailija-linkki') }}</span>
          <ep-linkki :url="$kaanna(linkit.virkailija)" icon="ulkoinen-linkki"></ep-linkki>
        </div>
        <div class="col-lg-2 col-md-6 col-sm-12 mb-5">
          <span class="font-weight-bold">{{ $t('anna-palautetta') }}</span>
          <ep-linkki :url="$kaanna(linkit.palaute)" icon="envelope"></ep-linkki>
        </div>
        <div class="col-lg-2 col-md-6 col-sm-12 mb-5">
          <a :href="$kaanna(linkit.seloste)">{{ $t('tietosuojaseloste') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import ophLogo from '@assets/img/banners/oph_logo.svg';
import opintopolkuLogo from '@assets/img/banners/opintopolku_logo.svg';

@Component({
  name: 'EpFooter',
  components: {
    EpLinkki,
  },
})
export default class EpFooter extends Vue {
  get ophLogo() {
    return ophLogo;
  }

  get opintopolkuLogo() {
    return opintopolkuLogo;
  }

  get linkit() {
    return {
      oph: {
        fi: 'https://www.oph.fi/fi',
        sv: 'https://www.oph.fi/sv',
      },
      opintopolku: {
        fi: 'https://opintopolku.fi/wp/fi',
        sv: 'https://studieinfo.fi/wp/sv',
      },
      virkailija: {
        fi: 'http://virkailija.opintopolku.fi',
        sv: 'http://virkailija.opintopolku.fi',
      },
      palaute: {
        fi: 'mailto:eperusteet@opintopolku.fi',
        sv: 'mailto:eperusteet@opintopolku.fi',
      },
      seloste: {
        fi: 'https://opintopolku.fi/wp/tietosuojaseloste',
        sv: 'https://studieinfo.fi/wp/dataskyddsbeskrivning',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

footer {
  padding: 0;
  hyphens: none;
  margin-top: 100px;

  .horizontal-line {
    width: 100%;
    border: none;
    padding: 0;
    overflow: visible;
    text-align: center;
    background-color: #FFF;
    border-top-color: $gray-lighten-3;
    border-top-style: solid;
    border-top-width: 1px;

    img {
      top: -30px;
      padding: 0 50px;
      position: relative;
      background-color: #FFF;

    }
  }

  img {
    width: 300px;

    &.opintopolku {
      width: 200px;
    }
  }

  .footer-content {
    max-width: 90%;
    margin: 0 auto;
    padding: 20px 0;

  }
}

</style>

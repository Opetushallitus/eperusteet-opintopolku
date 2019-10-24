<template>
<footer role="contentinfo">
  <div class="footer-content">
    <div class="d-flex justify-content-center">
      <div class="col-xl">
        <img src="../../../public/img/banners/oph_logo.svg" :alt="$t('alt-oph-logo')" slot="footer-logo" />
      </div>
      <div class="col-lg">
        <b>{{ $t('opetushallitus') }}</b>
        <ep-linkki :url="$kaanna(linkit.oph)" icon="external-link-alt"></ep-linkki>
      </div>
      <div class="col-lg">
        <b>{{ $t('opintopolku') }}</b>
        <ep-linkki :url="$kaanna(linkit.opintopolku)" icon="external-link-alt"></ep-linkki>
      </div>
      <div class="col-lg">
        <b>{{ $t('eperusteet-virkailija-linkki') }}</b>
        <ep-linkki :url="$kaanna(linkit.virkailija)" icon="external-link-alt"></ep-linkki>
      </div>
      <div class="col-lg">
        <b>{{ $t('anna-palautetta') }}</b>
        <ep-linkki :url="$kaanna(linkit.palaute)" icon="envelope"></ep-linkki>
      </div>
      <div class="col-lg">
        <a :href="$kaanna(linkit.seloste)">{{ $t('tietosuojaseloste') }}</a>
      </div>
    </div>
  </div>
</footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';

@Component({
  name: 'EpFooter',
  components: {
    EpLinkki,
  },
})
export default class EpFooter extends Vue {
  get linkit() {
    return {
      oph: {
        fi: 'https://www.oph.fi/fi',
        sv: 'https://www.oph.fi/sv',
      },
      opintopolku: {
        fi: 'https://opintopolku.fi/wp/fi',
        sv: 'https://studieinfo.fi/wp/sv/',
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
      }
    };
  }
}
</script>

<style scoped lang="scss">
footer {
  border-top: 1px solid #ccc;
  padding: 40px;;

  img {
    width: 200px;
  }

  .footer-content {
    // margin: 0 auto;
    // padding: 0;

    .row {
      // margin-left: 0;
      // margin-right: 0;
      align-items: center;
      .col-slot {
        padding: 15px;
      }
    }

  }
}

</style>

<template>
<footer>
  <div class="footer-content">
    <div class="row">
      <div class="col-xl col-slot">
        <img src="../../../public/img/banners/oph_logo.svg" slot="footer-logo" />
      </div>
      <div class="col-lg col-slot">
        <b>{{ $t('opetushallitus') }}</b>
        <ep-linkki :url="$kaanna(linkit.oph)" icon="external-link-alt"></ep-linkki>
      </div>
      <div class="col-lg col-slot">
        <b>{{ $t('opintopolku') }}</b>
        <ep-linkki :url="$kaanna(linkit.opintopolku)" icon="external-link-alt"></ep-linkki>
      </div>
      <div class="col-lg col-slot">
        <b>{{ $t('eperusteet-virkailija-linkki') }}</b>
        <ep-linkki :url="$kaanna(linkit.virkailija)" icon="external-link-alt"></ep-linkki>
      </div>
      <div class="col-lg col-slot">
        <b>{{ $t('anna-palautetta') }}</b>
        <ep-linkki :url="$kaanna(linkit.palaute)" icon="envelope"></ep-linkki>
      </div>
      <div class="col-lg col-slot">
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
        sv: 'https://studieinfo.fi/wp/dataskyddsbeskrivning/',
      }
    };
  }
}
</script>

<style scoped lang="scss">
footer {
  border-top: 1px solid #ccc;
  padding: 0;
  hyphens: none;

  img {
    width: 200px;
  }

  .footer-content {
    max-width: 90%;
    margin: 0 auto;
    padding: 20px 0;

    .row {
      align-items: center;
      .col-slot {
        padding: 16px;
      }
    }

  }
}

</style>

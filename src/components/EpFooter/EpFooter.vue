<template>
  <div class="container">
    <footer>
      <div class="horizontal-line">
        <router-link :to="{ name: 'root'}">
          <img
            :src="ophLogo"
            :alt="$t('eperusteet')"
          >
        </router-link>
      </div>
      <div class="footer-row">
        <div class="footer-content">
          {{ $t('footer-eperusteet-palvelu') }}
        </div>
        <div class="footer-links">
          <EpPalauteLinkki yllapito-avain="eperusteet-opintopolku-palaute-url" />
          <div class="d-flex">
            <EpMaterialIcon>chevron_right</EpMaterialIcon>
            <ep-linkki :url="$kaanna(linkit.saavutettavuusseloste)">
              {{ $t('saavutettavuusseloste') }}
            </ep-linkki>
          </div>
          <div class="d-flex">
            <EpMaterialIcon>chevron_right</EpMaterialIcon>
            <EpLinkki
              :url="$kaanna(linkit.virkailija)"
              icon="launch"
              icon-right
            >
              {{ $t('siirry-virkailijanakymaan') }}
            </EpLinkki>
          </div>
        </div>
      </div>
      <div class="horizontal-line">
        <a :href="$kaanna(linkit.oph)">
          <img
            class="logo"
            :src="opintopolkuLogo"
            :alt="$t('oph')"
          >
        </a>
      </div>
      <div class="footer-row">
        <div class="footer-oph">
          {{ $t('footer-oph') }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { $kaanna } from '@shared/utils/globals';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import ophLogo from '@assets/img/banners/opintopolku/logo.svg';
import opintopolkuLogo from '@assets/img/banners/opintopolku/oph_logo2.png';
import EpPalauteLinkki from '@shared/components/EpPalauteLinkki/EpPalauteLinkki.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const linkit = {
  oph: {
    fi: 'https://www.oph.fi/fi',
    sv: 'https://www.oph.fi/sv',
    en: 'https://www.oph.fi/en',
  },
  virkailija: {
    fi: 'http://virkailija.opintopolku.fi',
    sv: 'http://virkailija.opintopolku.fi',
  },
  palaute: {
    fi: 'mailto:eperusteet@opintopolku.fi',
    sv: 'mailto:eperusteet@opintopolku.fi',
  },
  saavutettavuusseloste: {
    fi: 'https://opintopolku.fi/konfo/fi/sivu/eperusteet-saavutettavuusseloste',
    sv: 'https://opintopolku.fi/konfo/sv/sivu/tillganglighetsutlatande-for-egrunder',
  },
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

footer {
  padding-bottom: 50px;
  hyphens: none;
  margin-top: 100px;

  .horizontal-line {
    margin-top: 70px;
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

  .footer-content {
    width: 65%;
    display: flex;
    margin: 0 auto;

    @media (max-width: 991.98px) {
      padding: 0 20px;
      width: 100%;
    }
  }

  .footer-links {
    width: 35%;
    padding-left: 20px;
    color: $oph-green;

    @media (max-width: 991.98px) {
      padding: 20px;
      width: 100%;
    }
  }

  .footer-oph {
    justify-content: unset;
    font-size: 0.875rem;
    margin: 0 auto;
    width: 60%;

    @media (max-width: 991.98px) {
      padding: 0 20px;
      width: 100%;
    }
  }

  .footer-row {
    display: flex;

    @media (max-width: 991.98px) {
      display: grid;
    }
  }
}

.logo {
  width: 200px;
}

:deep(.linkki) {
  font-size: 1rem;
  padding-bottom: 3px;

  a {
    color: $oph-green;
  }
}
</style>

<template>
  <div class="container">
    <b-navbar type="dark"
              toggleable="md"
              class="navbar-ep">

      <b-navbar-brand href="#">
        <b-link :to="{ name: 'root' }">
          <img src="../../../public/img/icons/eperusteet-logo.svg" height="26">
        </b-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-for="(item, idx) in items" :key="idx"
                      :to="item.route">{{ $t(item.nimi) }}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class EpNavigation extends Vue {
  private get items() {
    return [
      {
        nimi: 'varhaiskasvatus',
        koulutustyypit: [
          'koulutustyyppi_20',
        ],
        route: { name: 'kooste', params: { koulutustyyppi: 'koulutustyyppi_20' } },
      },
      {
        nimi: 'esiopetus',
        koulutustyypit: [
          'koulutustyyppi_15',
        ],
        route: { name: 'kooste', params: { koulutustyyppi: 'koulutustyyppi_15' } },
      },
      {
        nimi: 'perusopetus',
        koulutustyypit: [
          'koulutustyyppi_6',
          'koulutustyyppi_16',
          'koulutustyyppi_17',
          'koulutustyyppi_22',
        ],
        route: { name: 'kooste', params: { koulutustyyppi: 'koulutustyyppi_16' } },
      },
      {
        nimi: 'taiteenperusopetus',
        koulutustyypit: [
          'koulutustyyppi_15',
        ],
        route: { name: 'kooste', params: { koulutustyyppi: 'koulutustyyppi_999907' } },
      },
      {
        nimi: 'lukiokoulutus',
        koulutustyypit: [
          'koulutustyyppi_2',
          'koulutustyyppi_14',
          'koulutustyyppi_23'
        ],
        route: { name: 'kooste', params: { koulutustyyppi: 'koulutustyyppi_2' } },
      },
      {
        nimi: 'ammatillinen-koulutus',
        koulutustyypit: [
          'koulutustyyppi_1',
          'koulutustyyppi_11',
          'koulutustyyppi_12'
        ],
        route: { name: 'kooste', params: { koulutustyyppi: 'koulutustyyppi_1' } },
      }
    ];
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.navbar-ep {
  padding: .3rem 0;
  // Todo: käytä muuttujaa
  @media (min-width: 768px) {
    padding: 0 0;
  }

  .navbar-brand {
    // Todo: käytä muuttujaa
    @media (min-width: 768px) {
      margin-right: 3rem;
    }
  }

  &.navbar-expand-md .navbar-nav .nav-link {
    padding-right: 1rem;
    padding-left: 1rem;
    // Todo: käytä muuttujaa
    @media (min-width: 768px) {
      padding-top: 0.8rem;
      padding-bottom: 0.55rem;
    }

    color: white;
    // Todo: käytä muuttujaa
    @media (max-width: 767.98px) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  // Todo: käytä muuttujaa
  @media (min-width: 768px) {
    &.navbar-expand-md .navbar-nav .nav-link.router-link-active {
      border-bottom: white 0.25rem solid;
      padding-bottom: 0.30rem;
    }
  }
}
</style>

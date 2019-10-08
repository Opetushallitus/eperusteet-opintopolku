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
                      :to="item.route">
            {{ $t(item.nimi) }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { koulutustyyppiStateName, koulutustyyppiRelaatiot } from '@/utils/perusteet';
import _ from 'lodash';

@Component
export default class EpNavigation extends Vue {
  get items() {
    return _.map(koulutustyyppiRelaatiot(), kt => {
      return {
        ...kt,
        nimi: koulutustyyppiStateName(kt.koulutustyyppi),
        route: {
          name: 'kooste',
          params: {
            koulutustyyppi: koulutustyyppiStateName(kt.koulutustyyppi),
          },
        },
      };
    });
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.container {
  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
    max-width: 768px;
  }
}

.navbar-ep {
  background-color: #1B47AF;

  #nav-collapse {
    background-color: #1B47AF;
  }

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

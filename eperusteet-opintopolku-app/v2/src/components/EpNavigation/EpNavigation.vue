<template>
<div>
  <b-navbar type="light"
            role="navigation"
            toggleable="lg"
            class="navbar-ep">
    <b-navbar-brand href="#">
      <b-link :to="{ name: 'root' }">
        <img src="../../../public/img/icons/eperusteet-logo.svg">
      </b-link>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <div class="container">
        <b-navbar-nav>
          <b-nav-item v-for="(item, idx) in items"
                      :key="idx"
                      active
                      :to="item.route">
            {{ $t(item.nimi) }}
          </b-nav-item>
        </b-navbar-nav>
      </div>
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
  @media (max-width: 767.98px) {
    padding: 0;
    margin: 0;
    max-width: 768px;
  }
}

.navbar-ep {
  background-color: #fff;
  height: 80px;

  ul {
    li {
      white-space: nowrap;
    }
  }

  #nav-collapse {
    background-color: #fff;
  }

  // Todo: käytä muuttujaa
  @media (min-width: 768px) {
    padding: 0 0;
  }

  .navbar-brand {
    padding: 20px 0 20px 53px;
    font-weight: bolder;

    // Todo: käytä muuttujaa
    @media (min-width: 768px) {
      // margin-right: 3rem;
    }
  }

  &.navbar-expand-lg .navbar-nav .nav-link {
    padding-right: 1rem;
    padding-left: 1rem;
    color: #000;
    font-weight: bold;

    // Todo: käytä muuttujaa
    @media (min-width: 768px) {
      padding-top: 0.8rem;
      padding-bottom: 0.55rem;
    }

    // Todo: käytä muuttujaa
    @media (max-width: 767.98px) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  // Todo: käytä muuttujaa
  @media (min-width: 768px) {
    &.navbar-expand-lg .navbar-nav .nav-link.router-link-active {
      border-bottom: #0143da 0.25rem solid;
      padding-bottom: 0.30rem;
    }
  }
}
</style>

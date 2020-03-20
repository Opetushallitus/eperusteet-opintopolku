<template>
<div>
  <ep-spinner v-if="!koulutustyyppi" />
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
    <template slot="header">
      {{ $t(ylaotsikko) }}
    </template>
  </ep-header>
  <div class="container-md container-fluid">

    <div v-if="$route.name === 'ammatillinenSelaus'">
      <div class="d-flex justify-content-between flex-lg-row flex-column">

        <router-link v-for="(linkki, index) in linkit" :key="'linkki'+index" :to="{ name: linkki.route }">
          <div class="box tile-background-shadow-selected shadow-tile d-inline-block text-center d-flex align-items-center">
            <div>
              <fas :icon="linkki.icon" class="icon" />
            </div>
            <div>
              {{$t(linkki.text)}}
            </div>
          </div>
        </router-link>

      </div>

      <div class="d-flex mb-4">
        <div class="flex-fill w-50 pr-5">
          <h2 class="mb-4">{{$t('mita-ovat-ammatilliset-tutkinnot')}}</h2>

          <p class="kuvaus">{{ $t('kooste-kuvaus-ammatillinen-koulutus') }}</p>
          <p class="kuvaus">{{ $t('kooste-kuvaus-perusteet') }}</p>
        </div>

        <div class="flex-fill w-50">
          <h2 class="mb-4">{{$t('tiedotteet')}}</h2>
        </div>
      </div>

      <h2 class="mb-2">{{$t('ammatillisten-tutkintojen-perusteet')}}</h2>
      <peruste-haku :peruste-haku-store="perusteHakuStoreNormaali" tyyppi="kooste"/>
    </div>

    <router-view v-else>
      <div class="mb-4">
        <router-link :to="{ name: 'ammatillinenSelaus' }">
          <fas icon="arrow-left" /> {{$t('palaa-ammatillinen-koulutus-sivulle')}}
        </router-link>
      </div>
    </router-view>

  </div>

</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpTiedoteList from '@shared/components/EpTiedoteList/EpTiedoteList.vue';
import PerusteHaku from './PerusteHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import { Meta } from '@shared/utils/decorators';

interface Ylalinkki {
  route: string;
  text: string;
  icon: string;
}

@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteHaku,
    EpTiedoteList,
  },
})
export default class RouteAmmatillinenSelaus extends Vue {
  private perusteHakuStoreNormaali = new PerusteHakuStore();
  private perusteHakuStoreKoulutusvienti = new PerusteHakuStore({ koulutusvienti: true });
  private perusteHakuStoreOhjeet = new PerusteHakuStore({
    perusteTyyppi: 'opas',
    koulutustyyppi: [],
  });

  get linkit(): Ylalinkki[] {
    return [
      {
        route: 'koulutuksenjarjestajat',
        text: 'selaa-koulutuksen-jarjestajia',
        icon:'ohjeet',
      },
      {
        route: 'ammatillinenohjeet',
        text: 'selaa-ohjeita-ja-materiaaleja',
        icon:'ohjeet',
      },
      {
        route: 'koulutusviennit',
        text: 'selaa-koulutusvienteja',
        icon:'ohjeet',
      }
    ];
  }

  get ylaotsikko() {
    switch (this.$route.name) {
    case 'koulutuksenjarjestajat': return 'koulutuksen-jarjestajat';
    case 'ammatillinenohjeet': return 'ohjeet-ja-materiaalit';
    case 'koulutusviennit': return 'koulutusviennit';
    default: return 'ammatillinen-koulutus';
    }
  }

  get koulutustyyppi() {
    return 'koulutustyyppi_1';
  }

  get murupolku() {
    return [{
      label: 'ammatillinen-koulutus',
      location: {
        name: 'ammatillinenSelaus',
      },
    }];
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('ammatillinen-koulutus'),
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';
@include shadow-tile;

.container-md {
  padding: 0px 30px;
}

.box {
  margin-bottom: 30px;
  padding: 20px 30px;
  border-radius: 10px;
}

.icon {
  font-size: 1.6rem;
  margin-right: 10px;
}

.kuvaus {
  font-size: small;
  color: #555;
}
</style>

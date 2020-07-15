<template>
<div>
  <ep-spinner v-if="!koulutustyyppi" />
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
    <template slot="header">
      {{ $t(ylaotsikko) }}
    </template>
  </ep-header>
  <div class="container-md">

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

      <div class="row mb-4">
        <div class="col-12 col-lg-6 pr-5">
          <h2 class="mb-4">{{$t('mita-ovat-ammatilliset-tutkinnot')}}</h2>

          <p class="kuvaus">{{ $t('kooste-kuvaus-ammatillinen-koulutus') }}</p>
          <p class="kuvaus">{{ $t('kooste-kuvaus-perusteet') }}</p>
        </div>

        <div class="col-12 col-lg-6">
          <h2 class="mb-4">{{$t('ajankohtaista')}}</h2>
          <ep-julki-lista :tiedot="tiedotteet" @avaaTieto="avaaTiedote">
            <template v-slot:lisaaBtnText>
              <div class="mt-2">
                {{$t('katso-lisaa-ajankohtaisia')}}
              </div>
            </template>
          </ep-julki-lista>
        </div>
      </div>

      <h2 class="mb-2">{{$t('ammatillisten-tutkintojen-perusteet')}}</h2>
      <peruste-ammatillinen-haku :peruste-haku-store="perusteHakuStoreNormaali" tyyppi="kooste"/>
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { PerusteHakuStore } from '@/stores/PerusteHakuStore';
import { Meta } from '@shared/utils/decorators';
import { AmmatillistenTiedoteStore } from '@/stores/AmmatillistenTiedoteStore';
import { koulutustyyppiRyhmat, KoulutustyyppiRyhma } from '@shared/utils/perusteet';
import * as _ from 'lodash';
import { TiedoteDto } from '@shared/api/eperusteet';

interface Ylalinkki {
  route: string;
  text: string;
  icon: string;
}

@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteAmmatillinenHaku,
    EpJulkiLista,
  },
})
export default class RouteAmmatillinenSelaus extends Vue {
  private perusteHakuStoreNormaali = new PerusteHakuStore();

  @Prop({ required: true })
  private ammatillistenTiedotteetStore!: AmmatillistenTiedoteStore;

  async mounted() {
    this.ammatillistenTiedotteetStore.init(this.ammatillisetkoulutusryhmat.koulutustyypit);
    this.ammatillistenTiedotteetStore.fetch();
  }

  get tiedotteet() {
    return this.ammatillistenTiedotteetStore.tiedotteet.value;
  }

  get ammatillisetkoulutusryhmat(): KoulutustyyppiRyhma {
    return _.filter(koulutustyyppiRyhmat(), koulutusryhma => koulutusryhma.ryhma === 'ammatillinen')[0];
  }

  get linkit(): Ylalinkki[] {
    return [
      {
        route: 'ammatillinenKoulutuksenjarjestajat',
        text: 'selaa-koulutuksen-jarjestajia',
        icon: 'lokaatio',
      },
      {
        route: 'ammatillinenOhjeet',
        text: 'selaa-ohjeita-ja-materiaaleja',
        icon: 'ohjeet',
      },
      {
        route: 'ammatillinenKoulutusviennit',
        text: 'selaa-koulutusvienteja',
        icon: 'lokaatio-nuoli',
      },
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

  avaaTiedote(tiedote: TiedoteDto) {
    this.$router.push({
      name: 'uutinen',
      params: {
        tiedoteId: '' + tiedote.id,
      },
    });
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

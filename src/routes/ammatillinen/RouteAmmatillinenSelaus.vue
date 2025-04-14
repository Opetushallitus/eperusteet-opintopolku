<template>
  <div>
    <ep-spinner v-if="!koulutustyyppi" />
    <ep-header
      v-else
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template slot="header">
        {{ $t(ylaotsikko) }}
      </template>
    </ep-header>
    <div
      id="main"
      class="container-lg"
    >
      <div v-if="$route.name === 'ammatillinenSelaus'">
        <div class="d-flex justify-content-between flex-lg-row flex-column">
          <router-link
            v-for="(linkki, index) in linkit"
            :key="'linkki'+index"
            :to="linkki.route"
          >
            <div class="box tile-background-shadow-selected shadow-tile d-inline-block text-center d-flex align-items-center">
              <EpMaterialIcon
                v-if="linkki.icon"
                icon-shape="outlined"
              >
                {{ linkki.icon }}
              </EpMaterialIcon>
              <div class="align-self-center">
                {{ $t(linkki.text) }}
              </div>
            </div>
          </router-link>
        </div>

        <div class="row mb-4">
          <div class="col-12 col-lg-6 pr-5">
            <h2 class="mb-2">
              {{ $t('mita-ovat-ammatilliset-tutkinnot') }}
            </h2>

            <p class="kuvaus">
              {{ $t('kooste-kuvaus-ammatillinen-koulutus') }}
            </p>
            <p class="kuvaus">
              {{ $t('kooste-kuvaus-perusteet') }}
            </p>

            <h2 class="mb-2 mt-4">
              {{ $t('osallistu-kehitystyohon') }}
            </h2>
            <p class="kuvaus">
              {{ $t('ammatillinen-kehitystyo-kuvaus') }}
              <EpLinkki
                :url="furtherFeedbackUrl"
                icon="launch"
                icon-right
              >
                {{ $t('kerro-ehdotuksesi') }}
              </EpLinkki>
            </p>
          </div>

          <div class="col-12 col-lg-6">
            <h2 class="mb-2">
              {{ $t('ajankohtaista') }}
            </h2>
            <ep-julki-lista
              :tiedot="tiedotteet"
              @avaaTieto="avaaTiedote"
            >
              <template #lisaaBtnText>
                <div class="mt-2">
                  {{ $t('katso-lisaa-ajankohtaisia') }}
                </div>
              </template>
              <div slot="eiTietoja">
                {{ $t('ei-tiedotteita') }}
              </div>
            </ep-julki-lista>
          </div>
        </div>

        <h2 class="mb-2">
          {{ $t('tutkinnon-perusteet-ja-tutkinnon-osat') }}
        </h2>
        <peruste-ammatillinen-haku
          :peruste-haku-store="ammatillinenPerusteHakuStore"
          tyyppi="peruste"
        />
      </div>

      <router-view v-else>
        <div class="mb-4">
          <router-link :to="{ name: 'ammatillinenSelaus' }">
            <EpMaterialIcon>arrow_back</EpMaterialIcon>
            {{ $t('palaa-ammatillinen-koulutus-sivulle') }}
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
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { AmmatillinenPerusteHakuStore } from '@/stores/AmmatillinenPerusteHakuStore';
import { Meta } from '@shared/utils/decorators';
import { AmmatillistenTiedoteStore } from '@/stores/AmmatillistenTiedoteStore';
import { koulutustyyppiRyhmat, KoulutustyyppiRyhma } from '@shared/utils/perusteet';
import * as _ from 'lodash';
import { MaaraysDtoTyyppiEnum, TiedoteDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';

interface Ylalinkki {
  route: { name: string, query?: any, };
  text: string;
  icon?: string;
}

@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteAmmatillinenHaku,
    EpJulkiLista,
    EpMaterialIcon,
  },
})
export default class RouteAmmatillinenSelaus extends Vue {
  @Prop({ required: true })
  private ammatillistenTiedotteetStore!: AmmatillistenTiedoteStore;

  @Prop({ required: true })
  private ammatillinenPerusteHakuStore!: AmmatillinenPerusteHakuStore;

  async mounted() {
    this.ammatillistenTiedotteetStore.init({ koulutusTyyppi: this.ammatillisetkoulutusryhmat.koulutustyypit });
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
        route: {
          name: 'maaraykset',
          query: {
            tyyppi: MaaraysDtoTyyppiEnum.AMMATILLINENMUU,
          },
        },
        text: 'maaraykset',
        icon: 'picture_as_pdf',
      },
      {
        route: { name: 'ammatillinenOhjeet' },
        text: 'ohjeet-ja-materiaalit',
        icon: 'menu_book',
      },
      {
        route: { name: 'ammatillinenKoulutuksenjarjestajat' },
        text: 'koulutuksen-jarjestajat',
        icon: 'location_on',
      },
    ];
  }

  get ylaotsikko() {
    switch (this.$route.name) {
    case 'ammatillinenKoulutuksenjarjestajat': return 'koulutuksen-jarjestajat';
    case 'ammatillinenOhjeet': return 'ohjeet-ja-materiaalit';
    case 'ammatillinenKoulutusviennit': return 'koulutusviennit';
    case 'ammatillinenTyopajat': return 'selaa-tyopajoja';
    case 'ammatillinenValmisteillaOlevat': return 'valmisteilla-olevat-perusteet';
    case 'ammatillinenMaaraykset': return 'maaraykset';
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
    },
    ...this.alamurupolku,
    ];
  }

  get alamurupolku() {
    if (this.ylaotsikko !== 'ammatillinen-koulutus') {
      return [{
        label: this.ylaotsikko,
      }];
    }
    return [];
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

  get sisaltokieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get furtherFeedbackUrl() {
    return `https://www.oph.fi/${this.sisaltokieli}/koulutus-ja-tutkinnot/tutkintorakenne/lomake`;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';
@include shadow-tile;

.container-lg {
  margin-top: 1.5rem;
}

.container-md {
  padding: 0 30px;
}

.box {
  margin-bottom: 20px;
  padding: 20px 30px;
  border-radius: 10px;
  height: 60px;
}

.icon {
  font-size: 1.6rem;
  margin-right: 10px;
}

.kuvaus {
  font-size: smaller;
  color: $gray-lighten-12;
}

@media (max-width: 991.98px) {
  .container-md {
    padding: 0 15px;
  }
}
</style>

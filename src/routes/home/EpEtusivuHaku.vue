<template>
  <div>
    <EpSearch class="mb-4" v-model="queryNimi" :placeholder="$t('hae-suunnitelmia-tai-perusteita')"/>
    <div v-if="hasResults" class="mb-1">
      <span class="font-weight-bold mr-1">{{ kokonaismaara }}</span>
      <span>{{ $t('hakutulosta') }}</span>
    </div>
    <div v-for="(item, idx) in opsitJaPerusteet" :key="idx" class="mb-3">
      <div class="list-item">
        <router-link :to="item.route">
          <div class="d-flex tile-background-shadow-selected shadow-tile align-items-center">
            <div class="mx-3 my-3">
              <div :class="item.theme"/>
            </div>
            <div class="my-3 mr-3">
              <div class="nimi">
                {{ $kaanna(item.nimi) }}
              </div>
              <div v-if="item.voimassaoloAlkaa" class="meta">
                {{ $t('voimaantulo-pvm')}}: {{ $sd(item.voimassaoloAlkaa) }}
              </div>
              <div v-if="item.organisaatiot && item.organisaatiot.length > 0" class="meta mr-2">
                <span class="mr-1">{{ $t('oppilaitokset') }}:</span>
                <span v-for="(oppilaitos, tidx) in item.organisaatiot" :key="tidx">
                  <span>{{ $kaanna(oppilaitos.nimi) }}</span>
                  <span v-if="tidx < item.organisaatiot.length - 1">, </span>
                </span>
              </div>
              <div v-if="item.koulutustoimija" class="meta">
                <span class="mr-1">{{ $t('organisaatiot') }}:</span>
                <span>{{ $kaanna(item.koulutustoimija.nimi) }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="kokonaismaara > 0" class="mt-4">
      <b-pagination :value="sivu"
                    @change="updatePage"
                    :total-rows="kokonaismaara"
                    :per-page="sivukoko"
                    align="center"
                    aria-controls="opetussuunnitelmat-ja-perusteet-lista"
                    :first-text="$t('alkuun')"
                    prev-text="«"
                    next-text="»"
                    :last-text="$t('loppuun')"
                    :pills="true"
                    :disabled="isLoading"/>
    </div>
    <EpSpinner v-if="isLoading"></EpSpinner>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { koulutustyyppiStateName, koulutustyyppiTheme, yleissivistavatKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { PerusteStore } from '@/stores/PerusteStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { JulkiEtusivuDtoEtusivuTyyppiEnum } from '@shared/api/eperusteet';

@Component({
  components: {
    EpSpinner,
    EpSpinnerSlot,
    EpSearch,
  },
})
export default class EpEtusivuHaku extends Vue {
  @Prop({ required: true })
  private perusteStore!: PerusteStore;

  private queryNimi = '';
  private sivu = 1;
  private sivukoko = 10;
  private isLoading: boolean = false;
  OpasType = JulkiEtusivuDtoEtusivuTyyppiEnum.OPAS;

  mounted() {
    this.clear();
    this.queryChange();
  }

  get query() {
    return this.$route?.query?.query;
  }

  @Watch('query', { immediate: true })
  private async queryChange() {
    this.queryNimi = this.$route?.query?.query as string || '';
  }

  @Watch('queryNimi', { immediate: true })
  private async queryNimiChange() {
    if (_.size(this.queryNimi) > 2) {
      this.page = 1;
      await this.fetchOpsitJaPerusteet();
    }
    else {
      this.perusteStore.opsitJaPerusteet = null;
    }
  }

  get kieli() {
    return Kielet.getUiKieli.value;
  }

  @Watch('kieli')
  private async kieliChange() {
    this.clear();
  }

  private clear() {
    this.queryNimi = '';
    this.perusteStore.opsitJaPerusteet = null;
  }

  async updatePage(value) {
    this.page = value;
    await this.fetchOpsitJaPerusteet();
  }

  async fetchOpsitJaPerusteet() {
    this.isLoading = true;
    try {
      await this.perusteStore.getOpsitJaPerusteet({
        nimi: this.queryNimi,
        kieli: this.sisaltoKieli,
        sivu: this.sivu - 1,
        sivukoko: this.sivukoko,
      });

      this.$router.replace({ query: {
        query: this.queryNimi,
      } }).catch(() => {});
    }
    catch (e) {
      console.error(e);
    }
    this.isLoading = false;
  }

  get opsitJaPerusteet() {
    return _.chain(this.perusteStore.opsitJaPerusteet?.data)
      .map(resultItem => {
        return {
          ...resultItem,
          theme: {
            ['koulutustyyppi-' + koulutustyyppiTheme(resultItem.koulutustyyppi!)]: true,
            ['tyyppi-' + resultItem.etusivuTyyppi?.toLocaleLowerCase()]: true,
            'raita': resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.PERUSTE
            || resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.DIGITAALINENOSAAMINEN,
            'icon': resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.OPETUSSUUNNITELMA
            || resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.TOTEUTUSSUUNNITELMA
            || resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.OPAS,
          },
          koulutustyyppi: resultItem.jotpatyyppi === 'MUU' ? 'koulutustyyppi_muu' : resultItem.koulutustyyppi,
        };
      })
      .map(resultItem => {
        return {
          ...resultItem,
          route: this.generateRoute(resultItem),
        };
      })
      .value();
  }

  generateRoute(resultItem) {
    if (resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.OPAS) {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: 'opas',
          perusteId: _.toString(resultItem.id),
        },
      };
    }
    if (resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.PERUSTE) {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
          perusteId: _.toString(resultItem.id),
        },
      };
    }

    if (resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.DIGITAALINENOSAAMINEN) {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: 'digiosaaminen',
          perusteId: _.toString(resultItem.id),
        },
      };
    }

    if (_.includes(yleissivistavatKoulutustyypit, resultItem.koulutustyyppi)) {
      return {
        name: 'opetussuunnitelma',
        params: {
          koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
          opetussuunnitelmaId: _.toString(resultItem.id),
        },
      };
    }

    if (!_.includes(yleissivistavatKoulutustyypit, resultItem.koulutustyyppi)) {
      return {
        name: 'toteutussuunnitelma',
        params: {
          koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
          toteutussuunnitelmaId: _.toString(resultItem.id),
        },
      };
    }

    return {};
  }

  get kokonaismaara() {
    return this.perusteStore.opsitJaPerusteet?.kokonaismäärä;
  }

  get hasResults() {
    return _.isNumber(this.kokonaismaara);
  }

  get page() {
    return this.sivu;
  }

  set page(value) {
    this.sivu = value;
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

::v-deep .filter .form-control {
  padding: 20px 20px 20px 45px;
  border-radius: 0;
  border-color: #BBB;
  background: $white;
  height: 60px;
}

::v-deep .filter .form-control-feedback {
  padding-top: 10px;
  padding-left: 10px;
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: $gray;
}

::v-deep .page-item.disabled .page-link {
  color: $gray-lighten-3;
}

::v-deep .b-pagination li.page-item .page-link {
  background-color: unset;
  color: $white;
}

::v-deep .b-pagination li.page-item.active .page-link {
  background: $white;
  color: $oph-green;
}

.list-item {
  border: 1px solid #DADADA;
  margin-bottom: 10px;
  border-radius: 2px;
  background: $white;

  .nimi {
    font-weight: 600;
    color: $black;
    overflow-x: auto;

    ::v-deep a, div.linkki a {
      color: $black;
    }
  }

  .raita {
    min-height: 60px;
    background-color: #368715;
    border-radius: 3px;
    width: 6px;

    &.koulutustyyppi-ammatillinen {
      background-color: $koulutustyyppi-ammatillinen-color;
    }
    &.koulutustyyppi-esiopetus {
      background-color: $koulutustyyppi-esiopetus-color;
    }
    &.koulutustyyppi-lukiokoulutus {
      background-color: $koulutustyyppi-lukiokoulutus-color;
    }
    &.koulutustyyppi-perusopetus {
      background-color: $koulutustyyppi-perusopetus-color;
    }
    &.koulutustyyppi-varhaiskasvatus {
      background-color: $koulutustyyppi-varhaiskasvatus-color;
    }
    &.koulutustyyppi-taiteenperusopetus {
      background-color: $koulutustyyppi-taiteenperusopetus-color;
    }
    &.koulutustyyppi-vapaasivistystyo {
      background-color: $koulutustyyppi-vapaasivistystyo-color;
    }
    &.koulutustyyppi-tutkintoonvalmentava {
      background-color: $koulutustyyppi-tutkintoonvalmentava-color;
    }
    &.koulutustyyppi-kotoutumiskoulutus {
      background-color: $koulutustyyppi-kotoutumiskoulutus-color;
    }

    &.tyyppi-digiosaaminen {
      background-color: $digitaalinen-osaaminen-color;
    }

  }

  .icon {
    height: 40px;
    width: 40px;
    background-size: 40px 40px;
    background-repeat: no-repeat;

    &.tyyppi-opetussuunnitelma {
      background-image: url('../../../public/img/images/opskortti.svg');
    }

    &.tyyppi-toteutussuunnitelma {
      background-image: url('../../../public/img/images/totsukortti.svg');
    }

    &.tyyppi-opas {
      background-image: url('../../../public/img/images/opas_ikoni.svg');
    }
  }

  .meta {
    color: $black;
    font-size: 80%;
  }
}

.opsicon-wrapper {
  padding: 25px;

  .opsicon {
    height: 40px;
    width: 40px;
    background: url('../../../public/img/images/opskortti.svg') no-repeat;
    background-size: 40px 40px;
  }
}

::v-deep .spinner .oph-bounce {
  background-color: $white !important;
}
</style>

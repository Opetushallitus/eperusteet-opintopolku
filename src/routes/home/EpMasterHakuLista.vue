<template>
  <div>
    <EpSearch class="mb-4" v-model="queryNimi" :placeholder="$t('hae-suunnitelmia-tai-perusteita')"/>
    <EpSpinnerSlot :is-loading="isLoading">
      <div v-if="kokonaismaara > 0" class="mb-1">
        <span class="font-weight-bold mr-1">{{ kokonaismaara }}</span>
        <span>{{ $t('hakutulosta') }}</span>
      </div>
      <div v-for="(item, idx) in opsitJaPerusteet" :key="idx" class="mb-3">
        <div class="list-item">
          <router-link :to="item.route">
            <div class="sisalto d-flex justify-content-between align-content-stretch tile-background-shadow-selected shadow-tile">
              <div class="raita mx-3 my-3" :class="item.theme"></div>
              <div class="d-flex flex-fill align-items-center">
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
            </div>
          </router-link>
        </div>
      </div>
    </EpSpinnerSlot>

    <div class="mt-4">
      <b-pagination :value="sivu"
                    @change="updatePage"
                    :total-rows="kokonaismaara"
                    :per-page="sivukoko"
                    align="center"
                    aria-controls="opetussuunnitelmat-ja-perusteet-lista"
                    :first-text="$t('alkuun')"
                    prev-text="«"
                    next-text="»"
                    :last-text="$t('loppuun')" />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { koulutustyyppiStateName, koulutustyyppiTheme } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { PerusteStore } from '@/stores/PerusteStore';
import { JulkiEtusivuDtoTyyppiEnum } from '@shared/generated/eperusteet';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';

@Component({
  components: {
    EpSpinnerSlot,
    EpSearch,
  },
})
export default class EpMasterHakuLista extends Vue {
  @Prop({ required: true })
  private perusteStore!: PerusteStore;

  private queryNimi = '';
  private sivu = 1;
  private sivukoko = 10;
  private isLoading: boolean = false;

  @Watch('queryNimi')
  private async queryChange() {
    if (_.size(this.queryNimi) > 2) {
      await this.fetchOpsitJaPerusteet();
    }
    else {
      this.perusteStore.opsitJaPerusteet = null;
    }
  }

  async updatePage(value) {
    this.page = value;
    await this.fetchOpsitJaPerusteet();
  }

  async fetchOpsitJaPerusteet() {
    this.isLoading = true;
    await this.perusteStore.getOpsitJaPerusteet({
      nimi: this.queryNimi,
      kieli: this.sisaltoKieli,
      sivu: this.sivu - 1,
      sivukoko: this.sivukoko,
    });
    this.isLoading = false;
  }

  get opsitJaPerusteet() {
    return _.map(this.perusteStore.opsitJaPerusteet?.data, resultItem => {
      return {
        ...resultItem,
        theme: 'koulutustyyppi-' + koulutustyyppiTheme(resultItem.koulutustyyppi!),
        route: this.generateRoute(resultItem),
      };
    });
  }

  generateRoute(resultItem) {
    if (resultItem.tyyppi === JulkiEtusivuDtoTyyppiEnum.PERUSTE) {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
          perusteId: _.toString(resultItem.id),
        },
      };
    }
    else if (resultItem.tyyppi === JulkiEtusivuDtoTyyppiEnum.OPETUSSUUNNITELMA) {
      return {
        name: 'opetussuunnitelma',
        params: {
          koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
          opetussuunnitelmaId: _.toString(resultItem.id),
        },
      };
    }
    else {
      return {
        name: 'toteutussuunnitelma',
        params: {
          koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
          toteutussuunnitelmaId: _.toString(resultItem.id),
        },
      };
    }
  }

  get kokonaismaara() {
    return this.perusteStore.opsitJaPerusteet?.kokonaismäärä || 0;
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

.list-item {
  border: 1px solid #DADADA;
  margin-bottom: 10px;
  border-radius: 2px;

  .nimi {
    font-weight: 600;
    color: $black;
    overflow-x: auto;

    ::v-deep a, div.linkki a {
      color: $black;
    }
  }

  .raita {
    flex: 0 0 6px;
    min-height: 60px;
    background-color: #368715;
    border-radius: 3px;
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
  }

  .meta {
    color: $black;
    font-size: 80%;
  }
}
</style>

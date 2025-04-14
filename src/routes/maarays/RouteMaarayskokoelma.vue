<template>
  <ep-header
    tyyppi="maarayskokoelma"
    :murupolku="murupolku"
  >
    <template slot="header">
      {{ $t('opetushallituksen-maaraykset') }}
    </template>
    <template slot="subheader">
      {{ $t('opetushallituksen-maaraykset-alaotsikko') }}
    </template>

    <div class="d-flex flex-column flex-lg-row">
      <div class="w-100 mr-2 mb-3">
        <EpSearch
          v-model="query.nimi"
          :placeholder="$t('')"
        >
          <template #label>
            <span class="font-weight-600">{{ $t('hae-maarayksia') }}</span>
          </template>
        </EpSearch>
      </div>

      <div class="w-100 mr-2 mb-3">
        <EpMultiSelect
          v-model="query.tyyppi"
          :enable-empty-option="true"
          :placeholder="$t('kaikki')"
          :is-editing="true"
          :options="tyyppiVaihtoehdot"
          :search-identity="searchIdentity"
          :close-on-select="false"
        >
          <template #label>
            <span class="font-weight-600">{{ $t('tyyppi') }}</span>
          </template>

          <template
            slot="singleLabel"
            slot-scope="{ option }"
          >
            {{ $t('maarays-tyyppi-' + option.toLowerCase()) }}
          </template>
          <template
            slot="option"
            slot-scope="{ option }"
          >
            {{ $t('maarays-tyyppi-' + option.toLowerCase()) }}
          </template>
        </EpMultiSelect>
      </div>

      <div class="w-100 mb-3">
        <label class="font-weight-600">{{ $t('koulutus-tai-tutkinto') }}</label>
        <EpMaarayskokoelmaKoulutustyyppiSelect
          v-if="koulutustyyppiVaihtoehdot"
          v-model="query.koulutustyypit"
          class="maarayskokoelma-koulutustyyppi-select"
          :is-editing="true"
          :koulutustyypit="koulutustyyppiVaihtoehdot"
        />
      </div>
    </div>

    <EpVoimassaoloFilter
      v-model="query"
      class="mb-0"
    />

    <EpHakutulosmaara
      :kokonaismaara="maarayksetCount"
      piilota-nakyva-tulosmaara
    />

    <ep-spinner v-if="!maaraykset" />

    <div
      v-else-if="maaraykset.length === 0"
      class="mt-4"
    >
      {{ $t('ei-maarayksia') }}
    </div>

    <div
      v-else
      class="maaraykset"
    >
      <div class="jarjestys d-flex justify-content-end align-items-center mb-2">
        <a
          class="clickable"
          href="javascript:void(0)"
          @click="vaihdaJarjestys()"
        >
          <span v-if="query.jarjestys === 'DESC'">{{ $t('uusimmat-ensin') }} <EpMaterialIcon icon-shape="outlined">arrow_drop_down</EpMaterialIcon></span>
          <span v-if="query.jarjestys === 'ASC'">{{ $t('vanhimmat-ensin') }} <EpMaterialIcon icon-shape="outlined">arrow_drop_up</EpMaterialIcon></span>
        </a>
      </div>

      <router-link
        v-for="maarays in maaraykset"
        :key="maarays.id"
        class="maarays d-flex shadow-tile"
        :to="{name: 'maarays', params: {maaraysId: maarays.id}}"
      >
        <img
          :src="kuva"
          :alt="$t('maarays')"
          class="kuva"
        >
        <div class="tiedot">
          <div class="nimi font-weight-bold mb-2">
            {{ $kaanna(maarays.nimi) }}
          </div>
          <div class="alatiedot d-flex">
            <div class="mr-2">
              {{ $t('voimaantulo') }}: {{ $sd(maarays.voimassaoloAlkaa) }}
            </div>
            <EpVoimassaolo :voimassaolo="maarays" />
            <div
              v-if="maarays.asiasanat[kieli].asiasana.length > 0"
              class="mx-2 valiviiva"
            >
              |
            </div>
            <div v-if="maarays.asiasanat[kieli].asiasana.length > 0">
              {{ $t('asiasana') }}:
              <span
                v-for="(asiasana, index) in maarays.asiasanat[kieli].asiasana"
                :key="'asiasana' + index"
              >
                {{ asiasana }}<span v-if="index < maarays.asiasanat[kieli].asiasana.length -1">, </span>
              </span>
            </div>
          </div>
        </div>
      </router-link>

      <EpBPagination
        v-if="maarayksetCount > perPage"
        v-model="sivu"
        :items-per-page="perPage"
        :total="maarayksetCount"
        aria-controls="maarayskokoelma-lista"
      />
    </div>
  </ep-header>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Vue, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { MaaraysDtoTyyppiEnum } from '@shared/api/eperusteet';
import { Meta } from '@shared/utils/decorators';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import { MaarayksetStore } from '@shared/stores/MaarayksetStore';
import maaraysDocSmall from '@assets/img/images/maarays_doc_small.svg';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import EpMaarayskokoelmaKoulutustyyppiSelect from '@shared/components/EpMaarayskokoelmaKoulutustyyppiSelect/EpMaarayskokoelmaKoulutustyyppiSelect.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';

@Component({
  components: {
    EpHeader,
    EpToggle,
    EpSearch,
    EpMultiSelect,
    EpBPagination,
    EpSpinner,
    EpVoimassaoloFilter,
    EpVoimassaolo,
    EpButton,
    EpMaterialIcon,
    EpMaarayskokoelmaKoulutustyyppiSelect,
    EpHakutulosmaara,
  },
})
export default class RouteMaarayskokoelma extends Vue {
  private maarayksetStore: MaarayksetStore | null = null;

  private perPage = 10;
  private sivu = 1;
  private query = {
    nimi: '',
    sivukoko: 10,
    julkaistu: true,
    laadinta: false,
    jarjestysTapa: 'voimassaoloAlkaa',
    jarjestys: 'DESC',
    koulutustyypit: [],
    tyyppi: null,
    tuleva: true,
    voimassaolo: true,
  } as any;

  async mounted() {
    if (this.$route.query.tyyppi) {
      this.query.tyyppi = this.$route.query.tyyppi;
    }

    this.maarayksetStore = new MaarayksetStore();
    await this.maarayksetStore.init();
    await this.fetch();
  }

  @Watch('sivu')
  async sivuChange() {
    await this.fetch();
    (this.$el.querySelector('.maarays') as any)?.focus();
  }

  @Watch('query', { deep: true })
  async queryChange() {
    if (this.maarayksetStore) {
      this.sivu = 1;
      await this.fetch();
    }
  }

  async fetch() {
    if (_.size(this.query.nimi) === 0 || _.size(this.query.nimi) > 2) {
      await this.maarayksetStore?.fetch(
        {
          ...this.query,
          tyyppi: this.query.tyyppi === 'kaikki' ? null : this.query.tyyppi,
          kieli: this.kieli,
          sivu: this.sivu - 1,
        });
    }
  }

  get maaraykset() {
    return this.maarayksetStore?.maaraykset?.value?.data;
  }

  get maarayksetCount() {
    return this.maarayksetStore?.maaraykset?.value?.kokonaismäärä;
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('route-maarayskokoelma'),
    };
  }

  get tyyppiVaihtoehdot() {
    return [
      'kaikki',
      MaaraysDtoTyyppiEnum.OPETUSHALLITUKSENMUU,
      MaaraysDtoTyyppiEnum.AMMATILLINENMUU,
      MaaraysDtoTyyppiEnum.PERUSTE,
    ];
  }

  get voimasssaVaihtoehdot() {
    return [
      'KAIKKI',
      'TULEVA',
      'VOIMASSAOLO',
      'POISTUNUT',
    ];
  }

  get koulutustyyppiVaihtoehdot() {
    return this.maarayksetStore?.koulutustyypit.value;
  }

  get kuva() {
    return maaraysDocSmall;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get murupolku() {
    return [
      {
        label: 'route-maarayskokoelma',
        location: { name: 'maaraykset' },
      },
    ];
  }

  vaihdaJarjestys() {
    this.query.jarjestys = this.query.jarjestys === 'DESC' ? 'ASC' : 'DESC';
  }

  searchIdentity(kt: string) {
    return _.toLower(this.$t(kt) as any);
  }

}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.maaraykset {
  .maarays {
    border: 1px solid $gray-lighten-9;
    border-radius: 2px;
    padding: 12px 15px;
    margin-bottom: 10px;
    color: $black;

    .kuva {
      height: 55px;
    }

    .tiedot {
      margin-left: 15px;

      .valiviiva {
        color: $gray-lighten-1;
      }
    }
  }
}

::v-deep .toggles {
  margin-bottom: 0;
  padding-bottom: 0;
}

.maarayskokoelma-koulutustyyppi-select {
  max-width: 400px;
  width: 400px;
}

</style>

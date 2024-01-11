<template>
  <ep-main-view :container="true">
    <template slot="header">
      <h1>{{ $t('ohjeet-ja-materiaalit') }}</h1>
    </template>

    <div class="mb-4">

      <label>{{ $t('nimi') }}</label>
      <div class="d-flex justify-content-between">
        <ep-search :placeholder="$t('etsi-ohjeita')" class="w-50" v-model="query.nimi"/>
        <KoulutustyyppiSelect v-model="query.koulutustyyppi" :isEditing="true" class="w-50" :koulutustyypit="koulutustyypit"/>
      </div>

      <div class="d-flex mt-3">
        <b-form-checkbox v-model="query.tuleva" class="mr-4">
          {{ $t('tulevat') }}
        </b-form-checkbox>

        <b-form-checkbox v-model="query.voimassaolo">
          {{ $t('voimassaolevat') }}
        </b-form-checkbox>
      </div>
    </div>

    <ep-spinner v-if="!oppaat"/>

    <template v-else>
      <EpExternalLink
        :showIcon="false"
        v-for="opas in mappedOppaat"
        :key="opas.id"
        :url="opas.url"
        class="opas mb-2">
        <div class="d-flex">
          <div class="icon mr-3">
            <EpMaterialIcon>menu_book</EpMaterialIcon>
          </div>
          <div class="pt-1 text">
            <div class="nimi">{{$kaanna(opas.nimi)}}</div>
            <div v-if="opas.voimassaoloAlkaa">{{$t('voimaantulo')}} {{$sd(opas.voimassaoloAlkaa)}}</div>
          </div>
        </div>
      </EpExternalLink>

      <ep-pagination
        class="mt-3"
        v-model="sivu"
        :per-page="query.sivukoko"
        :total-rows="kokonaismaara"/>

    </template>
  </ep-main-view>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component, Watch } from 'vue-property-decorator';
import EpMainView from '@shared/components//EpMainView/EpMainView.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { OppaatStore } from '@shared/stores/OppaatStore';
import KoulutustyyppiSelect from '@shared/components/forms/EpKoulutustyyppiSelect.vue';
import { EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import EpPagination from '@shared/components/EpPagination/EpPagination.vue';
import { OppaatQuery } from '@shared/api/eperusteet';
import { buildEsikatseluUrl } from '@shared/utils/esikatselu';
import { Kielet } from '@shared/stores/kieli';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMainView,
    EpSpinner,
    EpSearch,
    KoulutustyyppiSelect,
    EpPagination,
    EpExternalLink,
    EpMaterialIcon,
  },
})
export default class EpOppaat extends Vue {
  @Prop({ default: () => EperusteetKoulutustyypit })
  private koulutustyypit!: string[];

  private store = new OppaatStore();

  private query = {
    sivu: 0,
    sivukoko: 20,
    nimi: '',
    voimassaolo: true,
    tuleva: true,
    koulutustyyppi: [],
  } as OppaatQuery;

  @Watch('query', { deep: true, immediate: true })
  async queryChange() {
    if (_.size(this.query.koulutustyyppi) === 0) {
      await this.store.fetch({
        ...this.query,
        koulutustyyppi: this.koulutustyypit,
      });
    }
    else {
      await this.store.fetch(this.query);
    }
  }

  get oppaat() {
    if (this.store.oppaat.value) {
      return this.store.oppaat.value.data;
    }
  }

  get mappedOppaat() {
    return _.map(this.oppaat, opas => {
      return {
        ...opas,
        url: buildEsikatseluUrl(Kielet.getSisaltoKieli.value, `/opas/${_.get(opas, 'id')}`),
      };
    });
  }

  get kokonaismaara() {
    return this.store.oppaat.value?.kokonaismäärä;
  }

  get sivu() {
    return this.query?.sivu! + 1;
  }

  set sivu(value: number) {
    this.query.sivu = value - 1;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .opas {
    color: $black;
    border: 1px solid $gray-lighten-8;
    padding: 0.3rem 0.5rem;
    border-radius: 0.2rem;

    .icon {
      font-size: 1.5rem;
      color: $blue-lighten-5;
    }

    .text {
      color: $black;

      .nimi {
        font-weight:600;
      }
    }

    &:hover {
      background-color: $gray-lighten-5;
      cursor: pointer;
    }
  }

</style>

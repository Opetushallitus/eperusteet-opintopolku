<template>
<div class="haku">
  <div class="search">

    <div v-if="tyyppi === 'peruste'">
      <div class="placeholderText">
        <span class="pr-1">{{searchPlaceholder}}</span>
        <span class="pr-1">{{$t('voit-hakea-tutkinnon-osia')}}</span>
        <ep-spinner v-if="!valmisteillaOlevat" small/>
        <span v-else-if="valmisteillaOlevat.data.length > 0">{{$t('katso-myos')}}
          <router-link class="w-100" :to="{name: 'ammatillinenValmisteillaOlevat'}">
            {{$t('valmisteilla-olevien-perusteiden-julkaisuaikataulu')}}
          </router-link>
        </span>
      </div>

      <div class="d-flex flex-lg-row flex-column" :class="{'disabled-events': !perusteetJaTutkinnonosat}">
        <b-form-group :label="$t('hae')" class="flex-fill" :aria-label="$t('hakuosio')">
          <EpSearch v-model="query"
                    :sr-placeholder="$t('tutkinnon-peruste-tai-tutkinnon-osa')"
                    :placeholder="$t('tutkinnon-peruste-tai-tutkinnon-osa')"/>
        </b-form-group>
        <b-form-group :label="$t('tutkintotyyppi')">
          <EpMultiSelect
            class="multiselect"
            v-model="tutkintotyyppi"
            :enable-empty-option="true"
            :placeholder="$t('kaikki')"
            :is-editing="true"
            :options="tutkintotyypit"
            :searchable="false">

            <template slot="singleLabel" slot-scope="{ option }">
              {{ $t(option) }}
            </template>

            <template slot="option" slot-scope="{ option }">
              {{ $t(option) }}
            </template>
          </EpMultiSelect>
        </b-form-group>
      </div>
    </div>

    <div v-else class="mb-3">
      <EpSearch v-model="query" :class="{'disabled-events': !perusteetJaTutkinnonosat}"/>
    </div>
    <EpSisaltotyyppiFilter v-if="tyyppi === 'peruste'" v-model="toggleQuery"></EpSisaltotyyppiFilter>
  </div>

  <div v-if="!perusteetJaTutkinnonosat">
    <ep-spinner />
  </div>

  <div v-else class="content">
    <div class="perusteet" id="perusteet-lista">
      <ep-ammatillinen-row v-for="(sisalto, idx) in perusteetJaTutkinnonosat"
                           :key="idx"
                           :route="sisalto.sisaltotyyppi === 'peruste' || sisalto.tutkinnonosa.tyyppi === 'reformi_tutke2' || sisalto.perusteet.length === 1 ? sisalto.route : null"
                           :class="sisalto.voimassaoloTieto[0].tyyppi">
        <div class="list-item-header">
          <div class="nimi">
            {{ $kaanna(sisalto.nimi) }}
            <div class="d-inline-flex">
              <span v-if="sisalto.laajuus">{{sisalto.laajuus}} {{$t('osaamispiste')}}</span>
            </div>
            <span v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'" class="koodi">({{ sisalto.tutkinnonosa.koodiArvo }})</span>
          </div>
          <div>
            <span class="tutkinto w-40" :class="sisalto.sisaltotyyppi">{{ sisalto.sisaltotyyppi === 'peruste' ? $t('tutkinnon-peruste') : $t('tutkinnon-osa') }}</span>
          </div>
        </div>

        <div v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'" class="d-flex" @click.prevent>
          <div v-if="sisalto.tutkinnonosa.tyyppi === 'normaali'">
            <div v-if="sisalto.perusteet.length === 1" class="nimikkeet">
              <span>{{ $kaanna(sisalto.perusteet[0].nimi) }},</span>
              <span v-for="(voimassaolotieto, index) in sisalto.perusteet[0].voimassaoloTieto" :key="'voimassa' + index">
                  <span v-if="index > 0">|</span>
                    {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
                  </span>
              <EpVoimassaolo :voimassaolo="sisalto"></EpVoimassaolo>
            </div>

            <EpCollapse v-else
                        :borderBottom="false"
                        :expandedByDefault="false"
                        :chevronLocation="'right'"
                        :use-padding="false">
              <template v-slot:header>
                <span class="ato-text">{{ $t('ammatillinen-tutkinnon-osa') }} | </span>
                <span class="peruste-count">{{ sisalto.perusteet.length }} {{sisalto.perusteet.length > 1 ? $t('tutkinnon-perustetta') : $t('tutkinnon-peruste') }}</span>
              </template>

              <div v-for="(peruste, oidx) in sisalto.perusteet" :key="oidx" class="nimikkeet">
                <router-link :to="{ name: 'tutkinnonosa', params: { perusteId: peruste.id, tutkinnonOsaViiteId: sisalto.id }, query: { redirect: 'true' }}">
                  {{ $kaanna(peruste.nimi) }},
                </router-link>
                <div class="peruste-rivi">
                  <span v-for="(voimassaolotieto, index) in peruste.voimassaoloTieto" :key="'voimassa' + index">
                  <span v-if="index > 0">|</span>
                    {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
                  </span>
                  <EpVoimassaolo :voimassaolo="sisalto"></EpVoimassaolo>
                </div>
              </div>
            </EpCollapse>
          </div>

          <div v-else class="ato-text">
            <span>{{ $t('yhteinen-tutkinnon-osa') }} | </span>
            <span>{{ sisalto.perusteet.length }} {{sisalto.perusteet.length > 1 ? $t('tutkinnon-perustetta') : $t('tutkinnon-peruste') }}</span>
          </div>
        </div>

        <div v-else>
          <div class="nimikkeet w-80" v-if="sisalto.tutkintonimikkeet && sisalto.tutkintonimikkeet.length > 0">
            <span class="kohde">{{ $t('tutkintonimikkeet') }}:</span>
            <span v-for="(tutkintonimike, tidx) in sisalto.tutkintonimikkeet" :key="tidx">
              {{ $kaanna(tutkintonimike.nimi) }}
            </span>
          </div>
          <div class="nimikkeet w-80" v-if="sisalto.osaamisalat && sisalto.osaamisalat.length > 0">
            <span class="kohde">{{ $t('osaamisalat') }}:</span>
            <span v-for="(osaamisala, oidx) in sisalto.osaamisalat" :key="oidx">
              {{ $kaanna(osaamisala.nimi) }}
            </span>
          </div>
          <div class="alatiedot">
            <span v-for="(voimassaolotieto, index) in sisalto.voimassaoloTieto" :key="'voimassa' + index">
              <span v-if="index > 0">|</span>
              {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
            </span>
            <EpVoimassaolo :voimassaolo="sisalto"></EpVoimassaolo>
            <span v-if="sisalto.diaarinumero">| {{$t('diaarinumero')}}: {{ sisalto.diaarinumero }}</span>
            <span v-if="sisalto.koulutukset && sisalto.koulutukset.length > 0">
              <template v-if="sisalto.koulutukset.length > 1">
                | {{$t('koulutuskoodit')}}: {{ sisalto.koulutuskoodit }}
              </template>
              <template v-else>
                | {{$t('koulutuskoodi')}}: {{ sisalto.koulutuskoodit }}
              </template>
            </span>
          </div>
        </div>
      </ep-ammatillinen-row>

    </div>
    <div class="pagination d-flex justify-content-center">
      <EpBPagination v-model="page"
                     :items-per-page="perPage"
                     :total="total"
                     aria-controls="perusteet-lista">
      </EpBPagination>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { IPerusteHakuStore } from '@/stores/IPerusteHakuStore';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import _ from 'lodash';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { voimassaoloTieto } from '@/utils/voimassaolo';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpSisaltotyyppiFilter from '@shared/components/EpSisaltotyyppiFilter/EpSisaltotyyppiFilter.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpCollapse,
    EpToggle,
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    EpAmmatillinenRow,
    EpMultiSelect,
    EpBPagination,
    EpSisaltotyyppiFilter,
    EpVoimassaolo,
  },
})
export default class PerusteAmmatillinenHaku extends Vue {
  @Prop({ required: true })
  private perusteHakuStore!: IPerusteHakuStore;

  @Prop({ type: String })
  private tyyppi!: 'peruste' | 'opas' | 'kooste';

  private valmisteillaOlevatStore: ValmisteillaOlevatStore = new ValmisteillaOlevatStore();
  private tutkintotyyppi = 'kaikki';

  private toggleQuery: any = {
    tuleva: false,
    voimassaolo: true,
    siirtyma: false,
    poistunut: false,
    perusteet: true,
    tutkinnonosat: false,
  };

  async mounted() {
    this.page = 1;
    if (!this.perusteHakuStore.perusteet) {
      await this.perusteHakuStore.fetch();
    }
    await this.valmisteillaOlevatStore.fetch(0, 1, AmmatillisetKoulutustyypit);
  }

  get tutkintotyypit() {
    return [
      'kaikki',
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
    ];
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  @Watch('kieli')
  async kieliChange() {
    this.perusteHakuStore.updateFilters({ kieli: this.kieli });
  }

  @Watch('tutkintotyyppi')
  tutkintotyyppiChange() {
    if (this.tutkintotyyppi === 'kaikki') {
      this.perusteHakuStore.updateFilters({ koulutustyyppi: [
        'koulutustyyppi_1',
        'koulutustyyppi_11',
        'koulutustyyppi_12',
        'koulutustyyppi_5',
        'koulutustyyppi_18',
      ] });
    }
    else {
      this.perusteHakuStore.updateFilters({ koulutustyyppi: [this.tutkintotyyppi] });
    }
  }

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }

  @Watch('toggleQuery', { deep: true })
  voimassaoloFilterChanged() {
    this.perusteHakuStore.updateFilters(this.toggleQuery);
    this.page = 1;
  }

  get searchPlaceholder() {
    if (this.tyyppi === 'opas') {
      return this.$t('ohjeen-tai-materiaalin-nimi');
    }
    else {
      return this.$t('voit-hakea-tutkintoa-nimella');
    }
  }

  get perusteetJaTutkinnonosat() {
    if (this.perusteHakuStore.perusteet) {
      return this.mapPerusteet(this.perusteHakuStore.perusteet);
    }
  }

  mapPerusteet(perusteet) {
    return _.chain(perusteet)
      .map(sisalto => ({
        ...sisalto,
        route: this.perusteTutkinnonosaRoute(sisalto),
        voimassaoloTieto: voimassaoloTieto(sisalto),
        koulutuskoodit: _.join(_.map(sisalto.koulutukset, 'koulutuskoodiArvo'), ', '),
        perusteet: sisalto.perusteet ? this.mapPerusteet(sisalto.perusteet) : null,
      }))
      .value();
  }

  perusteTutkinnonosaRoute(perusteTaiTutkinnonosa) {
    if (perusteTaiTutkinnonosa.tutkinnonosa?.tyyppi === 'reformi_tutke2') {
      return {
        name: 'yhteinentutkinnonosa',
        params: {
          koodi: perusteTaiTutkinnonosa.tutkinnonosa.koodiUri,
        },
      };
    }
    if (perusteTaiTutkinnonosa.perusteet?.length === 1) {
      return {
        name: 'tutkinnonosa',
        params: {
          perusteId: perusteTaiTutkinnonosa.perusteet[0].id,
          tutkinnonOsaViiteId: perusteTaiTutkinnonosa.id,
        },
        query: { redirect: 'true' },
      };
    }
    if (this.tyyppi === 'opas' || this.tyyppi === 'kooste') {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: 'ammatillinen',
          perusteId: _.toString(perusteTaiTutkinnonosa.id || perusteTaiTutkinnonosa.perusteId),
        },
      };
    }
    else {
      return {
        name: 'ammatillinenkooste',
        params: {
          perusteId: _.toString(perusteTaiTutkinnonosa.id),
        },
      };
    }
  }

  get total() {
    return this.perusteHakuStore.total;
  }

  get pages() {
    return this.perusteHakuStore.pages;
  }

  get perPage() {
    return this.perusteHakuStore.perPage;
  }

  get filters() {
    return this.perusteHakuStore.filters;
  }

  get query() {
    return this.filters.nimi;
  }

  set query(value) {
    this.perusteHakuStore.updateFilters({ nimi: value });
  }

  get page() {
    return this.perusteHakuStore.page + 1;
  }

  set page(value) {
    this.perusteHakuStore.page = value - 1;
    this.perusteHakuStore.updateFilters({ sivu: this.perusteHakuStore.page });
  }

  get valmisteillaOlevat() {
    return this.valmisteillaOlevatStore.perusteet.value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.placeholderText {
  font-size: small;
}

@media(min-width: 992px){
  .multiselect {
    width: 400px;
  }
}

.list-item-header {
  display: flex;

  @media(max-width: 992px){
    justify-content: space-between;
  }
}

.haku {
  width: 100%;

  ::v-deep .filter {
    max-width: 100%;
  }

  .nimi {
    font-weight: 600;
    margin-bottom: 5px;
    margin-right: 10px;

    @media(max-width: 992px){
      width: 60%;
    }
  }

  .nimikkeet {
    font-size: small;
    padding-bottom: 5px;

    @media(max-width: 992px){
      width: 100% !important;
      padding-bottom: 10px;
    }

    .kohde {
      font-weight: 600;
    }
  }

  .alatiedot {
    font-size: smaller;
  }

  .pagination {
    margin-top: 10px;
  }
}

.ato-text {
  color: #000;
  font-size: small;
}

.peruste-count {
  color: #3367E3;
  font-size: small;
}

.peruste-rivi {
  display: flex;

  @media(min-width: 992px){
    display: inline;
  }
}

.tutkinto {
  padding: 3px 12px;
  color: $white;
  border-radius: 12px;
  font-size: 12px;

  &.peruste {
    background: $blue-darken-1;
  }
  &.tutkinnonosa {
    background: $green;
  }
}

.koodi {
  margin-left: 5px;
  font-weight: 300;
  color: $gray;
}

.w-80 {
  width: 80%;
}

::v-deep .ep-collapse {
  margin-top: 0;

  .ml-auto {
    margin-left: 0 !important;

    .material-icons {
      font-size: 20px !important;
      vertical-align: middle;
    }
  }
}

</style>

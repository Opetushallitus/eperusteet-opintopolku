<template>
<div class="content">
  <div v-if="opintojakso">
    <h2 class="otsikko mb-4">{{ $kaanna(opintojakso.nimi)}}</h2>

    <div class="teksti">
      <div v-if="opintojakso.koodi" class="mb-4">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('koodi') }}</h3>
        <p>{{ opintojakso.koodi }}</p>
      </div>

      <div v-if="hasOppiaineet" class="mb-4">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('oppiaineet') }}</h3>
        <ul class="oppiaineet-list">
          <li v-for="(oppiaine, idx) in oppiaineetExtended" :key="idx">
            <div v-if="oppiaine.node">
              <router-link v-if="oppiaine.node.location" :to="oppiaine.node.location">
                {{ $kaanna(oppiaine.node.label) }}
                <span v-if="oppiaine.koodiLabel" class="code-field">({{ oppiaine.koodiLabel }})</span>
              </router-link>
            </div>
            <div v-else>
              {{ oppiaine.koodi }}
              <span v-if="oppiaine.koodiLabel" class="code-field">({{ oppiaine.koodiLabel }})</span>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="opintojakso.laajuus" class="mb-5">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('laajuus') }}</h3>
        <p>{{ opintojakso.laajuus }} {{ $t('opintopiste') }}</p>
      </div>
    </div>

    <div class="osio">
      <ep-collapse tyyppi="opintojakson-tavoitteet" :first="true">
        <div class="alueotsikko" slot="header"><h3>{{ $t('tavoitteet') }}</h3></div>
        <ep-opintojakson-tavoitteet :value="opintojakso"
                                    :moduulit-map="moduulitMap"
                                    :show-empty-alert="false" />
      </ep-collapse>
    </div>

    <div class="osio">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('keskeiset-sisallot') }}</h3></div>
        <ep-opintojakson-keskeiset-sisallot :value="opintojakso"
                                            :moduulit-map="moduulitMap"
                                            :show-empty-alert="false" />
      </ep-collapse>
    </div>

    <div class="osio">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('laaja-alaiset-sisallot') }}</h3></div>
        <ep-opintojakson-laaja-alaiset-osaamiset :value="opintojakso"
                                                 :opintojakson-oppiaineiden-tiedot="opintojaksonOppiaineidenTiedot"
                                                 :laaja-alaisten-koodit="laajaAlaistenKoodit"
                                                 :show-empty-alert="false" />
      </ep-collapse>
    </div>

    <div class="opintojakson-arviointi">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('arviointi') }}</h3></div>
        <ep-opintojakson-arviointi :value="opintojakso"
                                   :opintojakson-oppiaineiden-tiedot="opintojaksonOppiaineidenTiedot"
                                   :show-empty-alert="false" />
      </ep-collapse>
    </div>

    <div class="opintojakson-vapaa-kuvaus" v-if="hasKuvaus">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('opintojakson-vapaa-kuvaus') }}</h3></div>
        <ep-content-viewer v-if="opintojakso.kuvaus"
                            :value="$kaanna(opintojakso.kuvaus)"
                            :termit="termit"
                            :kuvat="kuvat" />
      </ep-collapse>
    </div>

    <div class="opintojakson-moduulit" v-if="opintojakso && opintojakso.moduulit">
      <ep-collapse :border-bottom="false">
        <div class="alueotsikko" slot="header"><h3>{{ $t('opintojakson-moduulit') }}</h3></div>
        <div class="oppiaineet">
          <div class="moduulit">
            <div class="moduuli" v-for="(moduuli, idx) in opintojakso.moduulit" :key="idx">
              <div v-if="moduulitMap[moduuli.koodiUri]">
                <router-link v-if="moduulitMap[moduuli.koodiUri].location"
                           :to="moduulitMap[moduuli.koodiUri].location">
                  <ep-opintojakson-moduuli :moduuli="moduulitMap[moduuli.koodiUri]"></ep-opintojakson-moduuli>
                </router-link>
                  <ep-opintojakson-moduuli v-else :moduuli="moduulitMap[moduuli.koodiUri]"></ep-opintojakson-moduuli>
              </div>
            </div>
          </div>
        </div>
      </ep-collapse>
    </div>

    <!--
    <div class="opintojakson-paikalliset-opintojaksot">
      <ep-collapse :border-bottom="false">
        <div class="alueotsikko" slot="header"><h3>{{ $t('opintojakson-paikalliset-opintojaksot') }}</h3></div>
      </ep-collapse>
    </div>
    -->

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpintojaksoDto, Ulkopuoliset, Lops2019ModuuliDto, Lops2019Oppiaineet, Lops2019Perusteet, Opetussuunnitelmat } from '@shared/api/ylops';
import { KoodistoLops2019LaajaAlaiset, koodiSorters } from '@shared/utils/perusteet';
import { PerusteCache } from '@shared/stores/peruste';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpOpintojaksonModuuli from '@shared/components/EpOpintojaksonModuuli/EpOpintojaksonModuuli.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpPrefixList from '@shared/components/EpPrefixList/EpPrefixList.vue';
import EpList from '@shared/components/forms/EpList.vue';
import EpOpintojaksonTavoitteet from '@shared/components/lops2019/EpOpintojaksonTavoitteet.vue';
import EpOpintojaksonKeskeisetSisallot from '@shared/components/lops2019/EpOpintojaksonKeskeisetSisallot.vue';
import EpOpintojaksonLaajaAlaisetOsaamiset from '@shared/components/lops2019/EpOpintojaksonLaajaAlaisetOsaamiset.vue';
import EpOpintojaksonArviointi from '@shared/components/lops2019/EpOpintojaksonArviointi.vue';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
    EpOpintojaksonModuuli,
    EpCollapse,
    EpPrefixList,
    EpList,
    EpOpintojaksonTavoitteet,
    EpOpintojaksonKeskeisetSisallot,
    EpOpintojaksonLaajaAlaisetOsaamiset,
    EpOpintojaksonArviointi,
  },
})
export default class RouteOpetussuunnitelmaOpintojakso extends Vue {
  private cache!: PerusteCache;
  private laajaAlaisetKoodit: any | null = null;
  private paikallisetOppiaineet: any | null = null;

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Watch('opintojakso', { immediate: true })
  async opintojaksoChange(val) {
    if (this.opintojakso) {
      const id = _.parseInt(this.$route.params.opetussuunnitelmaId);
      this.cache = await PerusteCache.of(id);
      this.laajaAlaisetKoodit = (await Opetussuunnitelmat.getKoodistonKoodit(id, KoodistoLops2019LaajaAlaiset)).data;
      this.paikallisetOppiaineet = (await Lops2019Oppiaineet.getAllLops2019PaikallisetOppiainet(id)).data;
    }
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get opintojakso() {
    if (this.$route) {
      return _.find(this.opetussuunnitelmaDataStore.opintojaksot, oj => {
        return oj.id === _.parseInt(this.$route.params.opintojaksoId);
      }) as Lops2019OpintojaksoDto;
    }
  }

  get laajaAlaistenKoodit() {
    const lisatyt = _.map(this.opintojakso!.laajaAlainenOsaaminen!, 'koodi');
    return _.map(this.laajaAlaisetKoodit, lo => ({
      koodi: lo.koodiUri,
      nimi: lo.nimi,
      hasPaikallinenKuvaus: _.includes(lisatyt, lo.koodi),
    }));
  }

  get kaikkiLaajaalaisetOsaamiset() {
    if (this.laajaAlainenOsaaminen) {
      return [
        ...this.laajaAlainenOsaaminen,
        ..._.chain(this.opintojakso!.paikallisetOpintojaksot)
          .map('laajaAlainenOsaaminen')
          .flatMap()
          .value(),
      ];
    }
  }

  get paikallisetOpintojaksot() {
    if (!_.isEmpty(this.opintojakso!.paikallisetOpintojaksot)) {
      return this.opintojakso!.paikallisetOpintojaksot;
    }
  }

  get paikallisetOppiaineetFormatted() {
    return _.chain(this.paikallisetOppiaineet)
      .filter('koodi')
      .map((oa) => {
        return {
          ...oa,
          koodi: {
            uri: oa.koodi,
          },
        };
      })
      .value();
  }

  get oppiaineet() {
    return [
      ...this.cache ? this.cache.peruste.oppiaineet : [],
      ...this.paikallisetOppiaineetFormatted,
    ];
  }

  get oppiaineetExtended() {
    if (this.opintojakso) {
      return _.map(this.opintojakso.oppiaineet, (oa: any) => {
        let koodiLabel;
        if (oa.koodi) {
          const node = this.navigationByUri[oa.koodi];
          if (node) {
            const { location, label } = node;
            oa.node = {
              location,
              label,
            };
            koodiLabel = _.get(node, 'meta.koodi.arvo') || _.get(node, 'meta.koodi');
          }
        }

        return {
          ...oa,
          koodiLabel,
        };
      });
    }
  }

  get hasOppiaineet() {
    return !_.isEmpty(this.oppiaineetExtended);
  }

  get moduuliKoodiUrit() {
    if (this.opintojakso) {
      return _.map(this.opintojakso.moduulit, 'koodiUri');
    }
  }

  get moduulit() {
    return _.chain(this.oppiaineetJaOppimaarat)
      .map((oa) => _.map(oa.moduulit, (moduuli) => ({
        ...moduuli,
        oppiaineUri: oa.koodi!.uri,
        location: { name: 'lops2019OpetussuunnitelmaModuuli',
          params: {
            oppiaineId: _.toString(oa.id),
            moduuliId: _.toString(moduuli.id),
          },
        },
      })))
      .flatten()
      .sortBy(...koodiSorters())
      .value();
  }

  get hasModuulit() {
    return !_.isEmpty(this.moduulit);
  }

  get moduulitMap() {
    return _.chain(this.moduulit)
      .keyBy('koodi.uri')
      .value();
  }

  get tavoitteet() {
    if (this.opintojakso) {
      return this.opintojakso.tavoitteet;
    }
  }

  get hasTavoitteet() {
    return !_.isEmpty(this.tavoitteet);
  }

  get paikallistenOpintojaksojenTavoitteet() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.tavoitteet))
      .value();
  }

  get keskeisetSisallot() {
    if (this.opintojakso) {
      return this.opintojakso.keskeisetSisallot;
    }
  }

  get paikallistenOpintojaksojenKeskeisetSisallot() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.keskeisetSisallot))
      .value();
  }

  get hasKeskeisetSisallot() {
    return !_.isEmpty(_.chain(this.keskeisetSisallot)
      .filter('kuvaus')
      .value());
  }

  get laajaAlainenOsaaminen() {
    if (this.opintojakso) {
      return this.opintojakso.laajaAlainenOsaaminen;
    }
  }

  get laajaAlainenOsaaminenExtended() {
    return _.chain(this.laajaAlaisetKoodit)
      .map(lo => ({
        ...lo,
        ..._.find(this.laajaAlainenOsaaminen, { koodi: lo.koodiUri }) as any,
      }))
      .value();
  }

  get hasLaajaAlainenOsaaminen() {
    return !_.isEmpty(_.chain(this.laajaAlainenOsaaminen)
      .filter('kuvaus')
      .value());
  }

  get paikallistenOpintojaksojenLaajaAlainenOsaaminenExtended() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.laajaAlainenOsaaminen))
      .map(paikallinenOpintojakso => ({
        ...paikallinenOpintojakso,
        laajaAlainenOsaaminen: _.chain(this.laajaAlaisetKoodit)
          .map(lo => ({
            ...lo,
            ..._.find(paikallinenOpintojakso.laajaAlainenOsaaminen, { koodi: lo.koodiUri }) as any,
          }))
          .filter('kuvaus')
          .value(),
      }))
      .value();
  }

  get hasArviointi() {
    if (this.opintojakso) {
      return this.opintojakso.arviointi;
    }
  }

  get paikallistenOpintojaksojenArviointi() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.arviointi))
      .value();
  }

  get hasKuvaus() {
    if (this.opintojakso) {
      return this.opintojakso.kuvaus;
    }
  }

  get navigationByUri() {
    return this.opetussuunnitelmaDataStore.navigationByUri;
  }

  get oppiaineetJaOppimaarat() {
    return _.chain(this.oppiaineet)
      .map((oa: any) => [oa, ..._.map(oa.oppimaarat, om => ({
        ...om,
        parentUri: oa.koodi.uri,
      }))])
      .flatten()
      .map((oa) => {
        return {
          ...oa,
          moduulit: _.sortBy(oa.moduulit, ...koodiSorters()),
        };
      })
      .value();
  }

  get oppiaineetMap() {
    return _.keyBy(this.oppiaineetJaOppimaarat, 'koodi.uri');
  }

  get opintojaksonOppiaineidenTiedot() {
    return _.chain(this.opintojakso ? this.opintojakso.oppiaineet : [])
      .map(({ koodi }) => koodi)
      .sortBy(...koodiSorters())
      .uniq()
      .map((uri: string) => {
        let oppiaineet = [this.oppiaineetMap[uri]];
        if (this.oppiaineetMap[uri] && this.oppiaineetMap[uri].parentUri) {
          oppiaineet = [this.oppiaineetMap[uri], this.oppiaineetMap[this.oppiaineetMap[uri].parentUri!]];
        }

        if (this.oppiaineetMap[uri] && this.oppiaineetMap[uri].perusteenOppiaineUri) {
          const perusteenOppiaine = this.oppiaineetMap[this.oppiaineetMap[uri].perusteenOppiaineUri];
          let perusteenOppiaineenParent;
          if (perusteenOppiaine.parentUri) {
            perusteenOppiaineenParent = this.oppiaineetMap[perusteenOppiaine.parentUri!];
          }
          oppiaineet = [this.oppiaineetMap[uri], perusteenOppiaine, perusteenOppiaineenParent];
        }

        return {
          nimi: this.oppiaineetMap[uri] ? this.oppiaineetMap[uri].nimi : undefined,
          arviointi: this.getOppiaineTieto(oppiaineet, 'arviointi'),
          laajaAlaisetOsaamiset: this.getOppiaineTieto(oppiaineet, 'laajaAlaisetOsaamiset'),
        };
      })
      .value();
  }

  getOppiaineTieto(oppiaineet, tieto) {
    if (oppiaineet) {
      return _.chain(oppiaineet)
        .filter(oppiaine => oppiaine && oppiaine[tieto] && oppiaine[tieto].kuvaus)
        .map(oppiaine => oppiaine[tieto])
        .head()
        .value();
    }

    return {};
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }

  .opintojakso-tieto-otsikko {
    font-size: 1em;
    font-weight: 500;
  }

  .opintojakso-lao-otsikko {
    font-size: 1em;
    font-weight: bold;
  }

  .paikallinen-opintojakso-content {
    border-radius: 24px;
    border: 1px solid #CDEEFF;
    padding: 14px 30px;
    display: flex;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #E6F6FF;

    &.selectable{
      cursor:pointer;
    }

    span.nimi {
      flex: 1 0 auto;
    }

    span.pituus {
      min-width: 4em;
    }

    span.tyyppi {
      min-width: 6em;
    }

    &.selected {
      background-color: #3367E3;
      color: $white;
    }

    &:hover:not(.selected.selectable) {
      background-color: #C3EAFF;
    }
  }
  .oppiaineet-list {
    list-style: none;
    padding-left: 0;
  }
  .alueotsikko {
    color: #010013;
    margin-bottom: 24px;
  }
  /deep/ .moduuliotsikko {
    color: #2B2B2B;
    margin-bottom: 8px;

    .moduulikuvaukset {
      font-size: 1rem;
    }
  }
  /deep/ .perustesisalto {
    color: #2B2B2B;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
  .moduulit {
    display: flex;
    flex-wrap: wrap;

    .moduuli {
      margin: 0 10px 10px 0;
    }
  }
}
</style>

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
        <p>{{ opintojakso.laajuus }} {{ $t('opintopiste') }}<template v-if="hasModulesWithLisalaajuus"> {{ laajuusInfo }}</template></p>
      </div>
    </div>

    <div class="osio" v-if="opintojakso.tavoitteet && opintojakso.tavoitteet.length > 0">
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

    <div class="osio" v-if="hasLaajaAlainenOsaaminen">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('laaja-alaiset-sisallot') }}</h3></div>
        <ep-opintojakson-laaja-alaiset-osaamiset :value="opintojakso"
                                                 :opintojakson-oppiaineiden-tiedot="opintojaksonOppiaineidenTiedot"
                                                 :laaja-alaisten-koodit="laajaAlaistenKoodit"
                                                 :show-empty-alert="false"
                                                 :showPerustesisalto="false" />
      </ep-collapse>
    </div>

    <div class="opintojakson-arviointi" v-if="hasArviointi">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('arviointi') }}</h3></div>
        <ep-opintojakson-arviointi :value="opintojakso"
                                   :opintojakson-oppiaineiden-tiedot="opintojaksonOppiaineidenTiedot"
                                   :show-empty-alert="false"
                                   :showPerustesisalto="false" />
      </ep-collapse>
    </div>

    <div class="opintojakson-opiskeluymparistoTyotavat" v-if="hasOpiskeluymparistoTyotavat">
      <ep-collapse>
        <div class="alueotsikko" slot="header"><h3>{{ $t('opiskeluymparisto-ja-tyotavat') }}</h3></div>
        <ep-content-viewer
            :value="$kaanna(opintojakso.opiskeluymparistoTyotavat)"
            :termit="termit"
            :kuvat="kuvat" />

        <div v-for="(paikallinenOpintojakso, index) in opintojakso.paikallisetOpintojaksot" :key="index+'paik-opiskeluymparistoTyotavat'" class="mt-4">
          <div v-if="paikallinenOpintojakso.opiskeluymparistoTyotavat && paikallinenOpintojakso.opiskeluymparistoTyotavat">
            <div class="moduuliotsikko"><h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4></div>
             <ep-content-viewer
              :value="$kaanna(paikallinenOpintojakso.opiskeluymparistoTyotavat)"
              :termit="termit"
              :kuvat="kuvat" />
          </div>
        </div>
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

    <div class="paikallisen-oppiaineen-opintojaksot" v-if="esitettavaPaikallistenOppiaineidenOpintojaksot.length > 0">
      <ep-collapse :border-bottom="false">
        <div class="alueotsikko" slot="header"><h3>{{ $t('paikallisen-oppiaineen-opintojaksot') }}</h3></div>
        <Ep-opintojakson-opintojaksot :value="opintojakso"
                                      :opintojaksot="opintojaksot"
                                      :oppiaineet-map="oppiaineetMap"
                                      :oppiaineet-ja-oppimaarat="oppiaineetJaOppimaarat"
                                      :oppiaineet="oppiaineetExtended" />
      </ep-collapse>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpintojaksoDto, Opetussuunnitelmat } from '@shared/api/ylops';
import { KoodistoLops2019LaajaAlaiset, koodiSorters } from '@shared/utils/perusteet';

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
import EpOpintojaksonOpintojaksot from '@shared/components/lops2019/EpOpintojaksonOpintojaksot.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

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
    EpOpintojaksonOpintojaksot,
    EpContent,
  },
})
export default class RouteOpetussuunnitelmaOpintojakso extends Vue {
  private laajaAlaisetKoodit: any | null = null;

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get opetussuunnitelmaId() {
    return _.toNumber(this.$route.params.opetussuunnitelmaId);
  }

  async mounted() {
    this.laajaAlaisetKoodit = (await Opetussuunnitelmat.getKoodistonKoodit(this.opetussuunnitelmaId, KoodistoLops2019LaajaAlaiset)).data;
  }

  get laajaAlaisetOsaamiset() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('laajaAlaisetOsaamiset');
  }

  get poppiaineet() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('paikallisetOppiaineet');
  }

  get opintojaksot() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('opintojaksot');
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get opintojakso() {
    if (this.$route) {
      return _.find(this.opintojaksot, oj => {
        return oj.id === _.parseInt(this.$route.params.opintojaksoId);
      }) as Lops2019OpintojaksoDto;
    }
  }

  get laajuusInfo(): string {
    return `(${_.toLower(this.$t('moduulit') as string)} ${this.laajuusModuuleista} ${this.$t('op')}, ${_.toLower(this.$t('lisalaajuus') as string)} ${this.lisaLaajuus} ${this.$t('op')})`;
  }

  get laajuusModuuleista(): number {
    return this.opintojakso!.laajuus! - this.lisaLaajuus;
  }

  get lisaLaajuus(): number {
    return this.opintojakso!.oppiaineet!.reduce((acc, { laajuus }) => acc + laajuus!, 0);
  }

  get hasModulesWithLisalaajuus(): boolean {
    return this.opintojakso!.moduulit!.length > 0 && this.lisaLaajuus > 0;
  }

  get paikallisetOppiaineet() {
    return _.chain(this.poppiaineet)
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

  get oppiaineet() {
    return [
      ...this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('lops2019.oppiaineet'),
      ...this.paikallisetOppiaineet,
    ];
  }

  get oppiaineidenModuulit() {
    return _.chain(this.oppiaineetJaOppimaarat)
      .map((oa: any) => {
        if (oa.perusteenOppiaineUri) {
          return {
            ...oa,
            moduulit: this.oppiaineetMap[oa.perusteenOppiaineUri].moduulit,
          };
        }
        else {
          return oa;
        }
      })
      .value();
  }

  get oppiaineidenModuulitMap() {
    return _.chain(this.oppiaineidenModuulit)
      .keyBy('koodi.uri')
      .value();
  }

  isModuuliton(oa: any) {
    return !_.isNil(oa.laajuus) || _.isEmpty(this.oppiaineidenModuulitMap[oa.koodi]) || _.isEmpty(this.oppiaineidenModuulitMap[oa.koodi].moduulit);
  }

  get oppiaineetExtended() {
    if (this.opintojakso) {
      return _.map(this.opintojakso.oppiaineet, (oa: any) => {
        let koodiLabel;
        if (oa.koodi) {
          const node = this.oppiaineetNavigationByUri[oa.koodi];
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
          isPaikallinenOppiaine: _.includes(_.map(this.paikallisetOppiaineet, 'koodi.uri'), oa.koodi),
          isModuuliton: this.isModuuliton(oa),
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
    return _.get(this.opintojakso, 'tavoitteet') || [];
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
    return _.get(this.opintojakso, 'keskeisetSisallot') || [];
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
    return _.get(this.opintojakso, 'laajaAlainenOsaaminen') || null;
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
    if (this.opintojakso && this.opintojakso.arviointi) {
      const template = document.createElement('div');
      template.innerHTML = this.$kaanna(this.opintojakso.arviointi);
      if (template.textContent || template.innerText) {
        return this.opintojakso.arviointi;
      }
    }
  }

  get paikallistenOpintojaksojenArviointi() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.arviointi))
      .value();
  }

  get hasOpiskeluymparistoTyotavat() {
    return _.get(this.opintojakso, 'opiskeluymparistoTyotavat') || null;
  }

  get hasKuvaus() {
    return _.get(this.opintojakso, 'kuvaus') || null;
  }

  get oppiaineetNavigationByUri() {
    return this.opetussuunnitelmaDataStore.oppiaineetNavigationByUri;
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

  get esitettavaPaikallistenOppiaineidenOpintojaksot() {
    return _.chain(this.oppiaineetExtended)
      .filter('isPaikallinenOppiaine')
      .map((oppiaine) => {
        return {
          oppiaine,
          opintojaksot: _.filter(this.opintojakso!.paikallisetOpintojaksot, (paikallinenOpintojakso) => _.includes(_.map(paikallinenOpintojakso.oppiaineet, 'koodi'), oppiaine.koodi)),
        };
      })
      .filter(oppiaineOpintojakso => !_.isEmpty(oppiaineOpintojakso.opintojaksot))
      .sortBy(...koodiSorters())
      .value();
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

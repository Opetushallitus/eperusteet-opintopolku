<template>
  <div class="content">
    <div v-if="opintojakso">
      <h2 class="otsikko mb-4">
        {{ $kaanna(opintojakso.nimi) }}
      </h2>

      <div class="teksti">
        <div
          v-if="opintojakso.koodi"
          class="mb-4"
        >
          <h3 class="opintojakso-tieto-otsikko">
            {{ $t('koodi') }}
          </h3>
          <p>{{ opintojakso.koodi }}</p>
        </div>
        <div
          v-if="hasOppiaineet"
          class="mb-4"
        >
          <h3 class="opintojakso-tieto-otsikko">
            {{ $t('oppiaineet') }}
          </h3>
          <ul class="oppiaineet-list">
            <li
              v-for="(oppiaine, idx) in oppiaineetExtended"
              :key="idx"
            >
              <div v-if="oppiaine.node">
                <router-link
                  v-if="oppiaine.node.location"
                  :to="oppiaine.node.location"
                >
                  {{ $kaanna(oppiaine.node.label) }}
                  <span
                    v-if="oppiaine.koodiLabel"
                    class="code-field"
                  >({{ oppiaine.koodiLabel }})</span>
                </router-link>
              </div>
              <div v-else>
                {{ oppiaine.koodi }}
                <span
                  v-if="oppiaine.koodiLabel"
                  class="code-field"
                >({{ oppiaine.koodiLabel }})</span>
              </div>
            </li>
          </ul>
        </div>
        <div
          v-if="opintojakso.laajuus"
          class="mb-5"
        >
          <h3 class="opintojakso-tieto-otsikko">
            {{ $t('laajuus') }}
          </h3>
          <p>
            {{ opintojakso.laajuus }} {{ $t('opintopiste') }}<template v-if="hasModulesWithLisalaajuus">
              {{ laajuusInfo }}
            </template>
          </p>
        </div>
      </div>

      <div class="osio">
        <ep-collapse
          tyyppi="opintojakson-tavoitteet"
          :first="true"
        >
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('tavoitteet') }}</h3>
            </div>
          </template>
          <ep-opintojakson-tavoitteet
            :value="opintojakso"
            :moduulit-map="moduulitMap"
            :show-empty-alert="false"
          />
        </ep-collapse>
      </div>

      <div class="osio">
        <ep-collapse>
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('keskeiset-sisallot') }}</h3>
            </div>
          </template>
          <ep-opintojakson-keskeiset-sisallot
            :value="opintojakso"
            :moduulit-map="moduulitMap"
            :show-empty-alert="false"
          />
        </ep-collapse>
      </div>

      <div
        v-if="hasLaajaAlainenOsaaminen"
        class="osio"
      >
        <ep-collapse>
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('laaja-alaiset-sisallot') }}</h3>
            </div>
          </template>
          <ep-opintojakson-laaja-alaiset-osaamiset
            :value="opintojakso"
            :opintojakson-oppiaineiden-tiedot="opintojaksonOppiaineidenTiedot"
            :laaja-alaisten-koodit="laajaAlaistenKoodit"
            :show-empty-alert="false"
            :show-perustesisalto="false"
          />
        </ep-collapse>
      </div>

      <div
        v-if="hasArviointi"
        class="osio"
      >
        <ep-collapse>
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('arviointi') }}</h3>
            </div>
          </template>
          <ep-opintojakson-arviointi
            :value="opintojakso"
            :opintojakson-oppiaineiden-tiedot="opintojaksonOppiaineidenTiedot"
            :show-empty-alert="false"
            :show-perustesisalto="false"
          />
        </ep-collapse>
      </div>

      <div
        v-if="hasOpiskeluymparistoTyotavat"
        class="osio"
      >
        <ep-collapse>
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('opiskeluymparisto-ja-tyotavat') }}</h3>
            </div>
          </template>
          <ep-content-viewer
            :value="$kaanna(opintojakso.opiskeluymparistoTyotavat)"
            :termit="termit"
            :kuvat="kuvat"
          />

          <div
            v-for="(paikallinenOpintojakso, index) in opintojakso.paikallisetOpintojaksot"
            :key="index+'paik-opiskeluymparistoTyotavat'"
            class="mt-4"
          >
            <div v-if="paikallinenOpintojakso.opiskeluymparistoTyotavat && paikallinenOpintojakso.opiskeluymparistoTyotavat">
              <div class="moduuliotsikko">
                <h4>{{ $kaanna(paikallinenOpintojakso.nimi) }}</h4>
              </div>
              <ep-content-viewer
                :value="$kaanna(paikallinenOpintojakso.opiskeluymparistoTyotavat)"
                :termit="termit"
                :kuvat="kuvat"
              />
            </div>
          </div>
        </ep-collapse>
      </div>

      <div
        v-if="hasKuvaus"
        class="osio"
      >
        <ep-collapse>
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('opintojakson-vapaa-kuvaus') }}</h3>
            </div>
          </template>
          <ep-content-viewer
            v-if="opintojakso.kuvaus"
            :value="$kaanna(opintojakso.kuvaus)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </ep-collapse>
      </div>

      <div
        v-if="opintojakso && opintojakso.moduulit"
        class="opintojakson-moduulit"
      >
        <ep-collapse :border-bottom="false">
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('opintojakson-moduulit') }}</h3>
            </div>
          </template>
          <div class="oppiaineet">
            <div class="moduulit">
              <div
                v-for="(moduuli, idx) in opintojakso.moduulit"
                :key="idx"
                class="mb-2"
              >
                <div v-if="moduulitMap[moduuli.koodiUri]">
                  <router-link
                    v-if="moduulitMap[moduuli.koodiUri].location"
                    :to="moduulitMap[moduuli.koodiUri].location"
                  >
                    <ep-opintojakson-moduuli :moduuli="moduulitMap[moduuli.koodiUri]" />
                  </router-link>
                  <ep-opintojakson-moduuli
                    v-else
                    :moduuli="moduulitMap[moduuli.koodiUri]"
                  />
                </div>
              </div>
            </div>
          </div>
        </ep-collapse>
      </div>

      <div
        v-if="esitettavaPaikallistenOppiaineidenOpintojaksot.length > 0"
        class="paikallisen-oppiaineen-opintojaksot"
      >
        <ep-collapse :border-bottom="false">
          <template #header>
            <div
              class="alueotsikko"
            >
              <h3>{{ $t('paikallisen-oppiaineen-opintojaksot') }}</h3>
            </div>
          </template>
          <Ep-opintojakson-opintojaksot
            :value="opintojakso"
            :opintojaksot="opintojaksot"
            :oppiaineet-map="oppiaineetMap"
            :oppiaineet-ja-oppimaarat="oppiaineetJaOppimaarat"
            :oppiaineet="oppiaineetExtended"
          />
        </ep-collapse>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
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
import { $kaanna, $t, $kaannaOlioTaiTeksti } from '@shared/utils/globals';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const route = useRoute();
const laajaAlaisetKoodit = ref<any | null>(null);

const opetussuunnitelmaId = computed(() => {
  return _.toNumber(route.params.opetussuunnitelmaId);
});

onMounted(async () => {
  laajaAlaisetKoodit.value = (await Opetussuunnitelmat.getKoodistonKoodit(opetussuunnitelmaId.value, KoodistoLops2019LaajaAlaiset)).data;
});

const laajaAlaisetOsaamiset = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto('laajaAlaisetOsaamiset');
});

const poppiaineet = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto('paikallisetOppiaineet');
});

const opintojaksot = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto('opintojaksot');
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.termit;
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const opintojakso = computed(() => {
  if (route) {
    return _.find(opintojaksot.value, oj => {
      return oj.id === _.parseInt(route.params.opintojaksoId as string);
    }) as Lops2019OpintojaksoDto;
  }
  return undefined;
});

const laajuusInfo = computed((): string => {
  return `(${_.toLower($t('moduulit'))} ${laajuusModuuleista.value} ${$t('op')}, ${_.toLower($t('lisalaajuus'))} ${lisaLaajuus.value} ${$t('op')})`;
});

const laajuusModuuleista = computed((): number => {
  return opintojakso.value!.laajuus! - lisaLaajuus.value;
});

const lisaLaajuus = computed((): number => {
  return opintojakso.value!.oppiaineet!.reduce((acc, { laajuus }) => acc + laajuus!, 0);
});

const hasModulesWithLisalaajuus = computed((): boolean => {
  return opintojakso.value!.moduulit!.length > 0 && lisaLaajuus.value > 0;
});

const paikallisetOppiaineet = computed(() => {
  return _.chain(poppiaineet.value)
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
});

const laajaAlaistenKooditComputed = computed(() => {
  const lisatyt = _.map(opintojakso.value!.laajaAlainenOsaaminen!, 'koodi');
  return _.map(laajaAlaisetKoodit.value, lo => ({
    koodi: lo.koodiUri,
    nimi: lo.nimi,
    hasPaikallinenKuvaus: _.includes(lisatyt, lo.koodi),
  }));
});

const kaikkiLaajaalaisetOsaamiset = computed(() => {
  if (laajaAlainenOsaaminen.value) {
    return [
      ...laajaAlainenOsaaminen.value,
      ..._.chain(opintojakso.value!.paikallisetOpintojaksot)
        .map('laajaAlainenOsaaminen')
        .flatMap()
        .value(),
    ];
  }
  return undefined;
});

const paikallisetOpintojaksot = computed(() => {
  if (!_.isEmpty(opintojakso.value!.paikallisetOpintojaksot)) {
    return opintojakso.value!.paikallisetOpintojaksot;
  }
  return undefined;
});

const oppiaineet = computed(() => {
  return [
    ...opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('lops2019.oppiaineet'),
    ...paikallisetOppiaineet.value,
  ];
});

const oppiaineidenModuulit = computed(() => {
  return _.chain(oppiaineetJaOppimaarat.value)
    .map((oa: any) => {
      if (oa.perusteenOppiaineUri) {
        return {
          ...oa,
          moduulit: oppiaineetMap.value[oa.perusteenOppiaineUri].moduulit,
        };
      }
      else {
        return oa;
      }
    })
    .value();
});

const oppiaineidenModuulitMap = computed(() => {
  return _.chain(oppiaineidenModuulit.value)
    .keyBy('koodi.uri')
    .value();
});

const isModuuliton = (oa: any) => {
  return !_.isNil(oa.laajuus) || _.isEmpty(oppiaineidenModuulitMap.value[oa.koodi]) || _.isEmpty(oppiaineidenModuulitMap.value[oa.koodi].moduulit);
};

const oppiaineetExtended = computed(() => {
  if (opintojakso.value) {
    return _.map(opintojakso.value.oppiaineet, (oa: any) => {
      let koodiLabel;
      if (oa.koodi) {
        const node = oppiaineetNavigationByUri.value[oa.koodi];
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
        isPaikallinenOppiaine: _.includes(_.map(paikallisetOppiaineet.value, 'koodi.uri'), oa.koodi),
        isModuuliton: isModuuliton(oa),
      };
    });
  }

  return [];
});

const hasOppiaineet = computed(() => {
  return !_.isEmpty(oppiaineetExtended.value);
});

const moduuliKoodiUrit = computed(() => {
  if (opintojakso.value) {
    return _.map(opintojakso.value.moduulit, 'koodiUri');
  }
  return [];
});

const moduulit = computed(() => {
  return _.chain(oppiaineetJaOppimaarat.value)
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
});

const hasModuulit = computed(() => {
  return !_.isEmpty(moduulit.value);
});

const moduulitMap = computed(() => {
  return _.chain(moduulit.value)
    .keyBy('koodi.uri')
    .value();
});

const tavoitteet = computed(() => {
  return _.get(opintojakso.value, 'tavoitteet') || [];
});

const hasTavoitteet = computed(() => {
  return !_.isEmpty(tavoitteet.value);
});

const paikallistenOpintojaksojenTavoitteet = computed(() => {
  return _.chain(paikallisetOpintojaksot.value)
    .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.tavoitteet))
    .value();
});

const keskeisetSisallot = computed(() => {
  return _.get(opintojakso.value, 'keskeisetSisallot') || [];
});

const paikallistenOpintojaksojenKeskeisetSisallot = computed(() => {
  return _.chain(paikallisetOpintojaksot.value)
    .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.keskeisetSisallot))
    .value();
});

const hasKeskeisetSisallot = computed(() => {
  return !_.isEmpty(_.chain(keskeisetSisallot.value)
    .filter('kuvaus')
    .value());
});

const laajaAlainenOsaaminen = computed(() => {
  return _.get(opintojakso.value, 'laajaAlainenOsaaminen') || null;
});

const laajaAlainenOsaaminenExtended = computed(() => {
  return _.chain(laajaAlaistenKooditComputed.value)
    .map(lo => ({
      ...lo,
      ..._.find(laajaAlainenOsaaminen.value, { koodi: lo.koodiUri }) as any,
    }))
    .value();
});

const hasLaajaAlainenOsaaminen = computed(() => {
  return !_.isEmpty(_.chain(laajaAlainenOsaaminen.value)
    .value());
});

const paikallistenOpintojaksojenLaajaAlainenOsaaminenExtended = computed(() => {
  return _.chain(paikallisetOpintojaksot.value)
    .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.laajaAlainenOsaaminen))
    .map(paikallinenOpintojakso => ({
      ...paikallinenOpintojakso,
      laajaAlainenOsaaminen: _.chain(laajaAlaistenKooditComputed.value)
        .map(lo => ({
          ...lo,
          ..._.find(paikallinenOpintojakso.laajaAlainenOsaaminen, { koodi: lo.koodiUri }) as any,
        }))
        .filter('kuvaus')
        .value(),
    }))
    .value();
});

const hasArviointi = computed(() => {
  if (opintojakso.value && opintojakso.value.arviointi) {
    const template = document.createElement('div');
    template.innerHTML = $kaanna(opintojakso.value.arviointi);
    if (template.textContent || template.innerText) {
      return opintojakso.value.arviointi;
    }
  }
  return undefined;
});

const paikallistenOpintojaksojenArviointi = computed(() => {
  return _.chain(paikallisetOpintojaksot.value)
    .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.arviointi))
    .value();
});

const hasOpiskeluymparistoTyotavat = computed(() => {
  return _.get(opintojakso.value, 'opiskeluymparistoTyotavat') || null;
});

const hasKuvaus = computed(() => {
  return _.get(opintojakso.value, 'kuvaus') || null;
});

const oppiaineetNavigationByUri = computed(() => {
  return opetussuunnitelmaDataStore.oppiaineetNavigationByUri;
});

const oppiaineetJaOppimaarat = computed(() => {
  return _.chain(oppiaineet.value)
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
});

const oppiaineetMap = computed(() => {
  return _.keyBy(oppiaineetJaOppimaarat.value, 'koodi.uri');
});

const getOppiaineTieto = (oppiaineet, tieto) => {
  if (oppiaineet) {
    return _.chain(oppiaineet)
      .filter(oppiaine => oppiaine && oppiaine[tieto] && oppiaine[tieto].kuvaus)
      .map(oppiaine => oppiaine[tieto])
      .head()
      .value();
  }

  return {};
};

const opintojaksonOppiaineidenTiedot = computed(() => {
  return _.chain(opintojakso.value ? opintojakso.value.oppiaineet : [])
    .map(({ koodi }) => koodi)
    .sortBy(...koodiSorters())
    .uniq()
    .map((uri: string) => {
      let oppiaineetTiedot = [oppiaineetMap.value[uri]];
      if (oppiaineetMap.value[uri] && oppiaineetMap.value[uri].parentUri) {
        oppiaineetTiedot = [oppiaineetMap.value[uri], oppiaineetMap.value[oppiaineetMap.value[uri].parentUri!]];
      }

      if (oppiaineetMap.value[uri] && oppiaineetMap.value[uri].perusteenOppiaineUri) {
        const perusteenOppiaine = oppiaineetMap.value[oppiaineetMap.value[uri].perusteenOppiaineUri];
        let perusteenOppiaineenParent;
        if (perusteenOppiaine.parentUri) {
          perusteenOppiaineenParent = oppiaineetMap.value[perusteenOppiaine.parentUri!];
        }
        oppiaineetTiedot = [oppiaineetMap.value[uri], perusteenOppiaine, perusteenOppiaineenParent];
      }

      return {
        nimi: oppiaineetMap.value[uri] ? oppiaineetMap.value[uri].nimi : undefined,
        arviointi: getOppiaineTieto(oppiaineetTiedot, 'arviointi'),
        laajaAlaisetOsaamiset: getOppiaineTieto(oppiaineetTiedot, 'laajaAlaisetOsaamiset'),
      };
    })
    .value();
});

const esitettavaPaikallistenOppiaineidenOpintojaksot = computed(() => {
  return _.chain(oppiaineetExtended.value)
    .filter('isPaikallinenOppiaine')
    .map((oppiaine) => {
      return {
        oppiaine,
        opintojaksot: _.filter(opintojakso.value!.paikallisetOpintojaksot, (paikallinenOpintojakso) => _.includes(_.map(paikallinenOpintojakso.oppiaineet, 'koodi'), oppiaine.koodi)),
      };
    })
    .filter(oppiaineOpintojakso => !_.isEmpty(oppiaineOpintojakso.opintojaksot))
    .sortBy(...koodiSorters())
    .value();
});
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
  :deep(.moduuliotsikko) {
    color: #2B2B2B;
    margin-bottom: 8px;

    .moduulikuvaukset {
      font-size: 1rem;
    }
  }
  :deep(.perustesisalto) {
    color: #2B2B2B;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
}
</style>

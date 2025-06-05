<template>
  <div>
    <div v-if="koodi">
      <strong>{{ $t('koodi') }}</strong>
      <p>{{ koodi.arvo }}</p>
    </div>

    <div
      v-if="hasTehtava"
      class="mt-4"
    >
      <h3>{{ $t('oppiaine-ja-tehtava') }}</h3>
      <ep-content-viewer
        v-if="oppiaine.tehtava.kuvaus"
        :value="$kaanna(oppiaine.tehtava.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="hasLaajaAlaiset"
      class="mt-4"
    >
      <h3>{{ $t('laaja-alaisen-osaamisen-osa-alueet') }}</h3>
      <ep-content-viewer
        v-if="oppiaine.laajaAlaisetOsaamiset.kuvaus"
        :value="$kaanna(oppiaine.laajaAlaisetOsaamiset.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="hasOpiskeluymparistoTyotavat"
      class="mt-4"
    >
      <h3>{{ $t('opiskeluymparisto-ja-tyotavat') }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.opiskeluymparistoTyotavat.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="hasTavoitteet"
      class="mt-4"
    >
      <h3>{{ $t('tavoitteet') }}</h3>
      <ep-content-viewer
        v-if="tavoitteet.kuvaus"
        :value="$kaanna(tavoitteet.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />
      <div
        v-for="(tavoitealue, idx) in tavoitteet.tavoitealueet"
        :key="idx"
      >
        <strong v-if="tavoitealue.nimi">{{ $kaanna(tavoitealue.nimi ) }}</strong>
        <p v-if="tavoitealue.kohde">
          {{ $kaanna(tavoitealue.kohde) }}
        </p>
        <ul>
          <li
            v-for="(tavoite, idx) in tavoitealue.tavoitteet"
            :key="idx"
          >
            <span>{{ $kaanna(tavoite) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="hasArviointi"
      class="mt-4"
    >
      <h3>{{ $t('arviointi') }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.arviointi.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />
    </div>

    <hr
      v-if="hasOpintojaksot || hasModuulit"
      class="mt-4 mb-4"
    >

    <div
      v-if="hasOpintojaksot"
      class="mb-4"
    >
      <h3 id="opintojaksot">
        {{ $t('opintojaksot') }}
      </h3>
      <router-link
        v-for="(opintojakso, idx) in opintojaksotExtended"
        :key="idx"
        :to="opintojakso.location"
      >
        <div class="d-flex justify-content-between opintojakso mb-2">
          <div class="font-weight-bold">
            <span>{{ $kaanna(opintojakso.nimi) }}</span>
            <span
              v-if="opintojakso.koodiLabel"
              class="koodi ml-2"
            >({{ opintojakso.koodiLabel }})</span>
          </div>
          <div
            v-if="opintojakso.laajuus"
            class="opintopiste"
          >
            {{ opintojakso.laajuus }} {{ $t('opintopiste') }}
          </div>
        </div>
      </router-link>
    </div>

    <div
      v-if="hasModuulit"
      class="mt-4"
    >
      <h3 id="moduulit">
        {{ $t('moduulit') }}
      </h3>

      <div
        v-if="hasPakollisetModuulit"
        class="mb-4"
      >
        <h4>{{ $t('pakolliset-moduulit') }}</h4>
        <ep-content-viewer
          v-if="oppiaine.pakollisetModuulitKuvaus"
          :value="$kaanna(oppiaine.pakollisetModuulitKuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />

        <router-link
          v-for="(moduuli, idx) in pakollisetModuulitExtended"
          :key="idx"
          :to="moduuli.location"
        >
          <ep-opintojakson-moduuli
            class="mb-2"
            :moduuli="moduuli"
          />
        </router-link>
      </div>

      <div
        v-if="hasValinnaisetModuulit"
        class="mb-4"
      >
        <h4>{{ $t('valinnaiset-moduulit') }}</h4>
        <ep-content-viewer
          v-if="oppiaine.valinnaisetModuulitKuvaus"
          :value="$kaanna(oppiaine.valinnaisetModuulitKuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />

        <router-link
          v-for="(moduuli, idx) in valinnaisetModuulitExtended"
          :key="idx"
          :to="moduuli.location"
        >
          <ep-opintojakson-moduuli
            class="mb-2"
            :moduuli="moduuli"
          />
        </router-link>
      </div>
    </div>

    <div
      v-if="hasOppimaarat"
      class="mt-4"
    >
      <h3 id="oppimaarat">
        {{ $t('oppimaarat') }}
      </h3>
      <div
        v-for="(oppimaara, idx) in oppimaaratExtended"
        :key="idx"
      >
        <router-link
          v-if="oppimaara.location"
          :to="oppimaara.location"
        >
          {{ $kaanna(oppimaara.nimi) }}
        </router-link>
        <div v-else>
          {{ $kaanna(oppimaara.nimi) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import VueScrollTo from 'vue-scrollto';
import { ref, computed, onUpdated, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Lops2019OppiaineKaikkiDto, TermiDto, Lops2019OpintojaksoDto } from '@shared/api/ylops';
import { LiiteDtoWrapper } from '@shared/tyypit';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpOpintojaksonModuuli from '@shared/components/EpOpintojaksonModuuli/EpOpintojaksonModuuli.vue';
import { koodiSorters } from '@shared/utils/perusteet';

const props = defineProps({
  isPerusteView: {
    type: Boolean,
    default: true,
  },
  oppiaine: {
    type: Object as () => Lops2019OppiaineKaikkiDto,
    required: true,
  },
  termit: {
    type: Array as () => TermiDto[],
    default: () => [],
  },
  kuvat: {
    type: Array as () => LiiteDtoWrapper[],
    default: () => [],
  },
  navOppimaarat: {
    type: Array as () => NavigationNode[],
    default: () => [],
  },
  opintojaksot: {
    type: Array as () => Lops2019OpintojaksoDto[],
    default: () => [],
  },
});

const route = useRoute();

onUpdated(() => {
  // Odotetaan myös alikomponenttien päivittymistä
  nextTick(() => {
    if (route && route.hash && props.oppiaine) {
      if (route.hash === '#moduulit' && hasModuulit.value) {
        VueScrollTo.scrollTo('#moduulit');
      }
      else if (route.hash === '#oppimaarat' && hasOppimaarat.value) {
        VueScrollTo.scrollTo('#oppimaarat');
      }
    }
  });
});

const koodi = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.koodi;
  }

  return undefined;
});

const hasTehtava = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.tehtava && props.oppiaine.tehtava.kuvaus;
  }

  return undefined;
});

const hasLaajaAlaiset = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.laajaAlaisetOsaamiset && props.oppiaine.laajaAlaisetOsaamiset.kuvaus;
  }

  return undefined;
});

const tavoitteet = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.tavoitteet;
  }

  return undefined;
});

const hasTavoitteet = computed(() => {
  if (tavoitteet.value) {
    return !_.isEmpty(tavoitteet.value) && !_.isEmpty(tavoitteet.value.tavoitealueet);
  }

  return undefined;
});

const hasArviointi = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.arviointi && props.oppiaine.arviointi.kuvaus;
  }

  return undefined;
});

const hasOpiskeluymparistoTyotavat = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.opiskeluymparistoTyotavat && props.oppiaine.opiskeluymparistoTyotavat.kuvaus;
  }

  return undefined;
});

const opintojaksojenModuuliUrit = computed(() => {
  return _.chain(props.opintojaksot)
    .map(opintojakso => opintojakso.moduulit)
    .flatMap()
    .map(moduuli => moduuli.koodiUri)
    .value() as any[];
});

const moduulit = computed(() => {
  if (props.oppiaine) {
    return _.filter(props.oppiaine.moduulit, moduuli => _.size(opintojaksojenModuuliUrit.value) === 0 || _.includes(opintojaksojenModuuliUrit.value, _.get(moduuli, 'koodi.uri')));
  }

  return undefined;
});

const hasModuulit = computed(() => {
  return !_.isEmpty(moduulit.value);
});

const pakollisetModuulit = computed(() => {
  return _.filter(moduulit.value, { pakollinen: true });
});

const pakollisetModuulitExtended = computed(() => {
  if (pakollisetModuulit.value) {
    return _.map(pakollisetModuulit.value, moduuli => {
      return {
        ...moduuli,
        location: {
          name: props.isPerusteView ? 'lops2019moduuli' : 'lops2019OpetussuunnitelmaModuuli',
          params: { moduuliId: _.toString(moduuli.id) },
        },
        koodiLabel: _.get(moduuli, 'koodi.arvo'),
      };
    });
  }

  return undefined;
});

const hasPakollisetModuulit = computed(() => {
  return !_.isEmpty(pakollisetModuulit.value);
});

const valinnaisetModuulit = computed(() => {
  return _.filter(moduulit.value, { pakollinen: false });
});

const valinnaisetModuulitExtended = computed(() => {
  if (valinnaisetModuulit.value) {
    return _.map(valinnaisetModuulit.value, moduuli => {
      return {
        ...moduuli,
        location: {
          name: props.isPerusteView ? 'lops2019moduuli' : 'lops2019OpetussuunnitelmaModuuli',
          params: { moduuliId: _.toString(moduuli.id) },
        },
        koodiLabel: _.get(moduuli, 'koodi.arvo'),
      };
    });
  }

  return undefined;
});

const hasValinnaisetModuulit = computed(() => {
  return !_.isEmpty(valinnaisetModuulit.value);
});

const oppimaarat = computed(() => {
  if (props.oppiaine) {
    return props.oppiaine.oppimaarat;
  }

  return undefined;
});

const oppimaaratExtended = computed(() => {
  if (!_.isEmpty(props.navOppimaarat)) {
    return _.map(props.navOppimaarat, oppimaara => ({
      ...oppimaara,
      nimi: oppimaara.label,
    }));
  }
  else if (oppimaarat.value) {
    return _.map(oppimaarat.value, oppimaara => {
      return {
        ...oppimaara,
        location: {
          name: props.isPerusteView ? 'lops2019oppiaine' : 'lops2019OpetussuunnitelmaOppiaine',
          params: { oppiaineId: _.toString(oppimaara.id) },
        },
      };
    });
  }

  return undefined;
});

const hasOppimaarat = computed(() => {
  return !_.isEmpty(oppimaarat.value);
});

const hasOpintojaksot = computed(() => {
  return !_.isEmpty(props.opintojaksot);
});

const opintojaksotExtended = computed(() => {
  if (props.opintojaksot) {
    return _.chain(props.opintojaksot)
      .map(oj => {
        const ojOm: any = _.find(oj.oppiaineet, { koodi: props.oppiaine!.koodi!.uri });
        return {
          ...oj,
          location: {
            name: 'lops2019OpetussuunnitelmaOpintojakso',
            params: { opintojaksoId: _.toString(oj.id) },
          },
          koodiLabel: _.get(oj, 'koodi'),
          jarjestys: ojOm.jarjestys,
        };
      })
      .sortBy('jarjestys', ...koodiSorters())
      .value();
  }

  return undefined;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }

  .opintojakso {
    border-radius: 1rem;
    padding: 10px 20px;
    background-color: $blue-lighten-4;
    color: $blue-darken-1;

    .opintopiste {
      color: $gray;
    }
  }

  .opintojakso:hover {
    background-color: $blue-lighten-3;
  }
</style>

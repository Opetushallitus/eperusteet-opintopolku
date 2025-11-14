<template>
  <div class="content">
    <div v-if="oppiaine">
      <h2
        class="otsikko"
      >
        {{ $kaanna(oppiaine.nimi) }}
      </h2>

      <div class="teksti">
        <div>
          <div v-if="koodi">
            <strong>{{ $t('koodi') }}</strong>
            <p>{{ koodi }}</p>
          </div>

          <div
            v-if="hasTehtava || hasPerusteenOppianeenTehtava"
            class="mt-4"
          >
            <h3>{{ $t('tehtava') }}</h3>
            <ep-content-viewer
              v-if="hasPerusteenOppianeenTehtava"
              :value="$kaanna(perusteenOppiaine.tehtava.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
            <ep-content-viewer
              v-if="hasTehtava"
              :value="$kaanna(oppiaine.tehtava.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </div>

          <div
            v-if="hasTavoitteet || hasPerusteenOppiaineenTavoitteet"
            class="mt-4"
          >
            <h3>{{ $t('tavoitteet') }}</h3>
            <div v-if="hasPerusteenOppiaineenTavoitteet">
              <ep-content-viewer
                v-if="perusteenOppiaineenTavoitteet"
                :value="$kaanna(perusteenOppiaineenTavoitteet.kuvaus)"
                :termit="termit"
                :kuvat="kuvat"
              />
              <div
                v-for="(tavoitealue, idx) in perusteenOppiaineenTavoitteet.tavoitealueet"
                :key="'perusteenoppianeentavoite'+idx"
              >
                <strong v-if="tavoitealue.nimi">{{ $kaanna(tavoitealue.nimi ) }}</strong>
                <div>
                  <em v-if="tavoitealue.kohde">{{ $kaanna(tavoitealue.kohde) }}</em>
                </div>
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

            <div v-if="hasTavoitteet">
              <ep-content-viewer
                v-if="tavoitteet.kuvaus"
                :value="$kaanna(tavoitteet.kuvaus)"
                :termit="termit"
                :kuvat="kuvat"
              />
              <div
                v-for="(tavoitealue, idx) in tavoitteet.tavoitealueet"
                :key="'tavoite'+idx"
              >
                <strong v-if="tavoitealue.nimi">{{ $kaanna(tavoitealue.nimi ) }}</strong>
                <div>
                  <em v-if="tavoitealue.kohde">{{ $kaanna(tavoitealue.kohde) }}</em>
                </div>
                <ul>
                  <li
                    v-for="(tavoite, idx) in tavoitealue.tavoitteet"
                    :key="idx"
                  >
                    <span>{{ $kaanna(tavoite.tavoite) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            v-if="hasArviointi || hasPerusteenOppianeenArviointi"
            class="mt-4"
          >
            <h3>{{ $t('arviointi') }}</h3>

            <ep-content-viewer
              v-if="hasPerusteenOppianeenArviointi"
              :value="$kaanna(perusteenOppiaine.arviointi.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />

            <ep-content-viewer
              v-if="hasArviointi"
              :value="$kaanna(oppiaine.arviointi.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </div>

          <div
            v-if="hasLaajaAlainenOsaaminen || hasPerusteenOppiaineenLaajaAlainenOsaaminen"
            class="mt-4"
          >
            <h3>{{ $t('laaja-alainen-osaaminen') }}</h3>

            <ep-content-viewer
              v-if="hasPerusteenOppiaineenLaajaAlainenOsaaminen"
              :value="$kaanna(perusteenOppiaine.laajaAlaisetOsaamiset.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />

            <div v-if="hasLaajaAlainenOsaaminen">
              <ep-content-viewer
                v-if="oppiaine.laajaAlainenOsaaminen.kuvaus"
                :value="$kaanna(oppiaine.laajaAlainenOsaaminen.kuvaus)"
                :termit="termit"
                :kuvat="kuvat"
              />
              <div
                v-for="(lao, idx) in oppiaine.laajaAlainenOsaaminen"
                :key="'lao'+idx"
              >
                <div v-if="kooditFormatted[lao.koodi]">
                  <strong>
                    {{ $kaanna(kooditFormatted[lao.koodi].nimi) }}{{ kooditFormatted[lao.koodi].koodiArvo ? ' (' + kooditFormatted[lao.koodi].koodiArvo + ')' : '' }}
                  </strong>
                  <ep-content-viewer
                    :value="$kaanna(lao.kuvaus)"
                    :termit="termit"
                    :kuvat="kuvat"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="hasOpiskeluymparistoTyotavat || hasPerusteenOpiskeluymparistoTyotavat"
          class="mt-4"
        >
          <h3>{{ $t('opiskeluymparisto-ja-tyotavat') }}</h3>
          <ep-content-viewer
            v-if="hasPerusteenOpiskeluymparistoTyotavat"
            :value="$kaanna(perusteenOppiaine.opiskeluymparistoTyotavat.kuvaus)"
            :termit="termit"
            :kuvat="kuvat"
          />
          <ep-content-viewer
            v-if="hasOpiskeluymparistoTyotavat"
            :value="$kaanna(oppiaine.opiskeluymparistoTyotavat.kuvaus)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasOpintojaksot"
          class="mt-4"
        >
          <h3 id="opintojaksot">
            {{ $t('opintojaksot') }}
          </h3>
          <div
            v-for="(opintojakso, idx) in opintojaksotExtended"
            :key="'opintojakso'+idx"
          >
            <router-link
              v-if="opintojakso.location"
              :to="opintojakso.location"
            >
              {{ $kaanna(opintojakso.nimi) }}
              <span v-if="opintojakso.laajuus">
                ({{ opintojakso.laajuus }} op)
              </span>
            </router-link>
          </div>
        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import OppiaineEsitys from '@/routes/perusteet/sisalto/lops2019/oppiaineet/OppiaineEsitys.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { KoodistoKoodiDto, Opetussuunnitelmat } from '@shared/api/ylops';
import { KoodistoLops2019LaajaAlaiset } from '@shared/utils/perusteet';
import { $kaanna } from '@shared/utils/globals';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const route = useRoute();
const koodit = ref<KoodistoKoodiDto[]>([]);

const opetussuunnitelmaId = computed(() => {
  return _.toNumber(route.params.opetussuunnitelmaId);
});

onMounted(async () => {
  koodit.value = (await Opetussuunnitelmat.getKoodistonKoodit(opetussuunnitelmaId.value, KoodistoLops2019LaajaAlaiset)).data;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: oppiaineId.value });
});

const perusteenOppiaine = computed(() => {
  if (oppiaine.value.perusteenOppiaineUri) {
    return _.find(opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('lops2019.oppiaineet'),
      oppiaine => oppiaine.koodi.uri === oppiaine.value.perusteenOppiaineUri);
  }
  return undefined;
});

const kooditFormatted = computed(() => {
  const kooditMap: any = {};
  if (koodit.value) {
    _.each(koodit.value, koodi => {
      kooditMap[koodi.koodiUri!] = koodi;
    });
  }
  return kooditMap;
});

const koodi = computed(() => {
  if (oppiaine.value) {
    return oppiaine.value.koodi;
  }
  return undefined;
});

const hasTehtava = computed(() => {
  if (oppiaine.value) {
    return oppiaine.value.tehtava && oppiaine.value.tehtava.kuvaus;
  }
  return false;
});

const hasPerusteenOppianeenTehtava = computed(() => {
  if (perusteenOppiaine.value) {
    return perusteenOppiaine.value.tehtava && perusteenOppiaine.value.tehtava.kuvaus;
  }
  return false;
});

const tavoitteet = computed(() => {
  if (oppiaine.value) {
    return oppiaine.value.tavoitteet;
  }
  return undefined;
});

const hasArviointi = computed(() => {
  if (oppiaine.value) {
    return oppiaine.value.arviointi && oppiaine.value.arviointi.kuvaus;
  }
  return false;
});

const hasPerusteenOppianeenArviointi = computed(() => {
  if (perusteenOppiaine.value) {
    return perusteenOppiaine.value.arviointi && perusteenOppiaine.value.arviointi.kuvaus;
  }
  return false;
});

const hasOpiskeluymparistoTyotavat = computed(() => {
  return oppiaine.value && oppiaine.value.opiskeluymparistoTyotavat && !_.isEmpty(oppiaine.value.opiskeluymparistoTyotavat.kuvaus);
});

const hasPerusteenOpiskeluymparistoTyotavat = computed(() => {
  return perusteenOppiaine.value && perusteenOppiaine.value.opiskeluymparistoTyotavat && !_.isEmpty(perusteenOppiaine.value.opiskeluymparistoTyotavat.kuvaus);
});

const perusteenOppiaineenTavoitteet = computed(() => {
  if (perusteenOppiaine.value) {
    return perusteenOppiaine.value.tavoitteet;
  }
  return undefined;
});

const hasLaajaAlainenOsaaminen = computed(() => {
  if (oppiaine.value) {
    return !_.isEmpty(oppiaine.value.laajaAlainenOsaaminen);
  }
  return false;
});

const hasPerusteenOppiaineenLaajaAlainenOsaaminen = computed(() => {
  if (perusteenOppiaine.value) {
    return perusteenOppiaine.value.laajaAlaisetOsaamiset && perusteenOppiaine.value.laajaAlaisetOsaamiset.kuvaus;
  }
  return false;
});

const hasTavoitteet = computed(() => {
  if (tavoitteet.value) {
    return !_.isEmpty(tavoitteet.value) && !_.isEmpty(tavoitteet.value.tavoitealueet);
  }
  return false;
});

const hasPerusteenOppiaineenTavoitteet = computed(() => {
  if (perusteenOppiaineenTavoitteet.value) {
    return !_.isEmpty(perusteenOppiaineenTavoitteet.value) && !_.isEmpty(perusteenOppiaineenTavoitteet.value.tavoitealueet);
  }
  return false;
});

const current = computed(() => {
  return opetussuunnitelmaDataStore.current;
});

const opintojaksot = computed(() => {
  if (oppiaine.value && oppiaine.value.koodi) {
    return _.filter(opetussuunnitelmaDataStore.getJulkaistuSisalto('opintojaksot'), oj => {
      const uri = oppiaine.value!.koodi!.uri;
      return _.some(oj.oppiaineet, { koodi: uri });
    });
  }
  return undefined;
});

const opintojaksotExtended = computed(() => {
  if (current.value) {
    const opintojaksot = _.find(current.value.children, { type: 'opintojaksot' });
    if (opintojaksot) {
      return _.map(opintojaksot.children, oj => {
        return {
          ...oj,
          nimi: oj.label,
        };
      });
    }
  }
  return undefined;
});

const hasOpintojaksot = computed(() => {
  return !_.isEmpty(opintojaksotExtended.value);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

<template>
  <div>
    <slot name="sisalto-nimi" />

    <div class="flex flex-wrap">
      <div class="w-full">
        <EpFormGroup :label="$t('laajuus')">
          {{ perusteenOsa.laajuusMinimi }} - {{ perusteenOsa.laajuusMaksimi }} {{ $t('viikkoa') }}
        </EpFormGroup>
      </div>
    </div>

    <div
      v-if="koulutuksenosaKoodi"
      class="flex flex-wrap mb-4"
    >
      <div class="w-full">
        <h4>{{ $t('koulutuksenosan-koodi') }}</h4>
        <div>{{ koulutuksenosaKoodi }}</div>
      </div>
    </div>

    <div class="flex flex-wrap">
      <div class="w-full">
        <EpFormGroup :label="$t('kuvaus')">
          <ep-content-viewer
            :value="$kaanna(perusteenOsa.kuvaus)"
            :kuvat="kuvat"
          />
        </EpFormGroup>
      </div>
    </div>

    <template v-if="tavoitteet.length > 0 || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus)">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <h3 class="mb-4">
            {{ $t('tavoitteet') }}
          </h3>
          <EpFormGroup :label="$t('opiskelija')">
            <template v-if="tavoitteet.length > 0">
              <ul class="mb-0">
                <li
                  v-for="tavoite in tavoitteet"
                  :key="tavoite.id"
                >
                  {{ $kaanna(tavoite) }}
                </li>
              </ul>
            </template>
          </EpFormGroup>
          <EpPaikallinenTarkennus v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus">
            <ep-content-viewer
              :value="$kaanna(koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus)"
              :kuvat="kuvat"
            />
          </EpPaikallinenTarkennus>
        </div>
      </div>
    </template>

    <template v-if="perusteenOsa.laajaAlaisenOsaamisenKuvaus || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.laajaalaisetosaamiset.length > 0)">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <EpFormGroup>
            <template #label>
              <h3>
                {{ $t('laaja-alainen-osaaminen') }}
              </h3>
            </template>
            <!-- laaaja-alainen sisältää ainoastaan ohjetekstin perusteessa -->
            <!-- <ep-content-viewer :value="$kaanna(koulutuksenosa.laajaAlaisenOsaamisenKuvaus)" :kuvat="kuvat"/> -->
          </EpFormGroup>
          <template v-if="koulutuksenosa.paikallinenTarkennus">
            <div
              v-for="(lao, index) in koulutuksenosa.paikallinenTarkennus.laajaalaisetosaamiset"
              :key="'lao'+index"
              class="mb-4"
            >
              <div class="font-bold">
                {{ $kaanna(lao.nimi) }}
              </div>
              <ep-content-viewer
                v-if="laajaAlaisetKoodilla[lao.koodiUri]"
                :value="$kaanna(laajaAlaisetKoodilla[lao.koodiUri].perusteteksti)"
                :kuvat="kuvat"
              />
              <ep-content-viewer
                :value="$kaanna(lao.laajaAlaisenOsaamisenKuvaus)"
                :kuvat="kuvat"
              />
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="perusteenOsa.keskeinenSisalto || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.keskeinenSisalto)">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <EpFormGroup>
            <template #label>
              <h3>
                {{ $t('keskeinen-sisalto') }}
              </h3>
            </template>
            <ep-content-viewer
              :value="$kaanna(perusteenOsa.keskeinenSisalto)"
              :kuvat="kuvat"
            />
          </EpFormGroup>
          <EpPaikallinenTarkennus v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.keskeinenSisalto">
            <ep-content-viewer
              :value="$kaanna(koulutuksenosa.paikallinenTarkennus.keskeinenSisalto)"
              :kuvat="kuvat"
            />
          </EpPaikallinenTarkennus>
        </div>
      </div>
    </template>

    <template v-if="perusteenOsa.arvioinninKuvaus || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus)">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <EpFormGroup>
            <template #label>
              <h3>
                {{ $t('arviointi-teksti') }}
              </h3>
            </template>
            <ep-content-viewer
              :value="$kaanna(perusteenOsa.arvioinninKuvaus)"
              :kuvat="kuvat"
            />
          </EpFormGroup>
          <EpPaikallinenTarkennus v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus">
            <ep-content-viewer
              :value="$kaanna(koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus)"
              :kuvat="kuvat"
            />
          </EpPaikallinenTarkennus>
        </div>
      </div>
    </template>
    <template v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.koulutuksenJarjestajat.length > 0">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <EpFormGroup>
            <template #label>
              <h3>
                {{ $t('koulutuksen-jarjestajat') }}
              </h3>
            </template>

            <div
              v-for="(koulutuksenjarjestaja, i) in koulutuksenosa.paikallinenTarkennus.koulutuksenJarjestajat"
              :key="'ktj'+i"
              class="pt-3 pb-2 px-3 mb-3"
            >
              <h3>{{ $kaanna(koulutuksenjarjestaja.nimi) }}</h3>
              <EpFormGroup
                v-if="koulutuksenjarjestaja.url"
                :label="$t('toteutussuunnitelman-tai-koulutuksen-jarjestajan-verkkosivut')"
                class="mb-3"
              >
                <EpLinkki :url="koulutuksenjarjestaja.url[kieli]" />
              </EpFormGroup>

              <EpFormGroup
                v-if="koulutuksenjarjestaja.kuvaus"
                :label="$t('kaytannon-toteutus')"
                class="mb-0"
              >
                <ep-content-viewer
                  :value="$kaanna(koulutuksenjarjestaja.kuvaus)"
                  :kuvat="kuvat"
                />
              </EpFormGroup>
            </div>
          </EpFormGroup>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Matala, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import _ from 'lodash';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import { Kielet } from '@shared/stores/kieli';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import EpFormGroup from '@shared/components/forms/EpFormGroup.vue';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => Matala,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
  opetussuunnitelma: {
    type: Object as () => OpetussuunnitelmaDto,
    required: true,
  },
});

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const koulutuksenosa = computed(() => {
  return props.sisaltoviite.koulutuksenosa;
});

const koulutuksenosaKoodi = computed(() => {
  if (koulutuksenosa.value?.nimiKoodi) {
    return _.split(koulutuksenosa.value.nimiKoodi, '_')[1];
  }
  return undefined;
});

const laajaAlaisetOsaamiset = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisaltoList({ 'tyyppi': 'laajaalainenosaaminen' });
});

const laajaAlaisetKoodilla = computed(() => {
  return _.keyBy(laajaAlaisetOsaamiset.value, 'tuvaLaajaAlainenOsaaminen.nimiKoodi');
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const perusteenOsa = computed(() => {
  if (props.sisaltoviite.perusteenOsaId) {
    return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: props.sisaltoviite.perusteenOsaId });
  }
  else {
    return koulutuksenosa.value;
  }
});

const tavoitteet = computed(() => {
  return [
    ...(perusteenOsa.value?.tavoitteet ?? []),
    ...(koulutuksenosa.value?.paikallinenTarkennus ? koulutuksenosa.value?.paikallinenTarkennus?.tavoitteet ?? [] : []),
  ];
});
</script>

<style scoped lang="scss">

</style>

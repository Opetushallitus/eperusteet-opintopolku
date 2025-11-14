<template>
  <div>
    <ep-collapse
      v-for="(osaalue, index) in osaalueet"
      :key="'osaalue'+index"
      class="mb-3"
      :shadow="false"
      :border-bottom="false"
      :use-padding="false"
      :expanded-by-default="osaalueet.length === 1"
      blue
    >
      <template #header>
        <h4
          class="osaamistavoiteotsikko"
        >
          {{ $kaanna(osaalue.nimi) }} <span v-if="osaalue.koodi">({{ osaalue.koodi.arvo }})</span>
        </h4>
      </template>

      <div
        v-for="(osaamistavoite, otIndex) in osaalue.osaamistavoitteet"
        :key="'osaamistavoite'+ index + otIndex"
        class="mt-2"
      >
        <div class="osaamistavoiteotsikko">
          <span v-if="osaamistavoite.pakollinen">{{ $t('pakolliset-osaamistavoitteet') }}</span>
          <span v-else>{{ $t('valinnaiset-osaamistavoitteet') }}</span>
          <span>, {{ osaamistavoite.laajuus }} {{ $t('osaamispiste') }}</span>
        </div>

        <div
          class="mt-2"
          v-html="$kaanna(osaamistavoite.tavoitteet)"
        />

        <ep-ammatillinen-arvioinnin-kohdealueet
          v-if="osaamistavoite.arviointi && osaamistavoite.arviointi.arvioinninKohdealueet"
          :arviointiasteikot="arviointiasteikot"
          :arvioinnin-kohdealueet="osaamistavoite.arviointi.arvioinninKohdealueet"
        />
      </div>

      <template v-if="osaalue.pakollisetOsaamistavoitteet">
        <h4 class="mt-4">
          {{ $t('pakolliset-osaamistavoitteet') }}, {{ osaalue.pakollisetOsaamistavoitteet.laajuus }} {{ $t('osp') }}
        </h4>
        <Osaamistavoite
          v-if="osaalue.pakollisetOsaamistavoitteet"
          v-model="osaalue.pakollisetOsaamistavoitteet"
          :is-valinnainen="false"
          :show-laajuus="false"
          :show-koodi-arvo="false"
        >
          <template #osaamistavoitteet>
            <div />
          </template>
        </Osaamistavoite>
      </template>

      <template v-if="osaalue.valinnaisetOsaamistavoitteet">
        <hr>
        <h4>{{ $t('valinnaiset-osaamistavoitteet') }}, {{ osaalue.valinnaisetOsaamistavoitteet.laajuus }} {{ $t('osp') }}</h4>
        <Osaamistavoite
          v-model="osaalue.valinnaisetOsaamistavoitteet"
          :is-valinnainen="true"
          :show-laajuus="false"
          :show-koodi-arvo="false"
        >
          <template #osaamistavoitteet>
            <div />
          </template>
        </Osaamistavoite>
      </template>

      <hr>

      <div v-if="osaalue.arviointi && osaalue.arviointi.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="osaalue.arviointi">
          <template #header>
            <h4>
              {{ $t('arviointi') }}
            </h4>
          </template>
        </GeneerinenArviointiTaulukko>
      </div>

      <EpValmaTelmaSisalto :valma-telma-sisalto="osaalue.valmaTelmaSisalto" />
    </ep-collapse>
  </div>
</template>

<script setup lang="ts">
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import Osaamistavoite from '@shared/components/EpOsaamistavoite/Osaamistavoite.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpValmaTelmaSisalto from '@/components/EpAmmatillinen/EpValmaTelmaSisalto.vue';

const props = defineProps({
  osaalueet: {
    type: Array,
    required: true,
  },
  arviointiasteikot: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped lang="scss">

  .osaamistavoiteotsikko {
    font-weight: 600;
  }

</style>

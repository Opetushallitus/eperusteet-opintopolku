<template>
  <div>
    <slot name="sisalto-nimi" />
    
    <ep-collapse
      v-if="sisaltoviite.naytaPerusteenTeksti && sisaltoviite.perusteteksti"
      tyyppi="perusteteksti"
    >
      <template #header>
        <div
          class="collapse-header"
        >
          {{ $t('perusteen-teksti') }}
        </div>
      </template>
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.perusteteksti)"
        :kuvat="kuvat"
      />
    </ep-collapse>

    <ep-collapse
      v-if="sisaltoviite.naytaPohjanTeksti && sisaltoviite.pohjanTekstikappale && sisaltoviite.pohjanTekstikappale.teksti"
      tyyppi="pohjateksti"
    >
      <template #header>
        <div
          class="collapse-header"
        >
          {{ $t('pohjan-teksti') }}
        </div>
      </template>
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.pohjanTekstikappale.teksti)"
        :kuvat="kuvat"
      />
    </ep-collapse>

    <EpPaikallinenTarkennus v-if="sisaltoviite.tekstiKappale.teksti">
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.tekstiKappale.teksti)"
        :kuvat="kuvat"
      />
    </EpPaikallinenTarkennus>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Matala } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => Matala,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
});

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const current = computed((): NavigationNode | null => {
  return opetussuunnitelmaDataStore.current;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});

const alikappaleNumeroinnitById = computed(() => {
  if (current.value?.children) {
    return current.value?.children?.reduce((acc: any, child: any) => {
      acc[child.id] = child?.meta?.numerointi;
      return acc;
    }, {});
  }

  return {};
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  .collapse-header {
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
  }
}

</style>

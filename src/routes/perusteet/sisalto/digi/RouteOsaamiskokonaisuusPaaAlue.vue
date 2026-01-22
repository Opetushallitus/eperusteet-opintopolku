<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 class="otsikko mb-4">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <ep-content-viewer
        :value="$kaanna(perusteenOsa.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <EpFormGroup
        :label="$t('suodata-ikaryhman-mukaan')"
        class="mt-5"
      >
        <EpToggleGroup
          v-model="selectedTasot"
          :items="tasot"
          class="taso-group"
        >
          <template #default="{ item }">
            <div class="taso-label">
              <EpMaterialIcon
                v-if="selectedTasot.includes(item)"
                class="mr-2"
                icon-shape="outlined"
                size="1rem"
              >
                done
              </EpMaterialIcon>
              <div>{{ $t(item) }}</div>
            </div>
          </template>
        </EpToggleGroup>
      </EpFormGroup>

      <EpCollapse
        v-for="osaAlue in osaAlueet"
        :key="'osaalue' + osaAlue.id"
        :border-bottom="false"
      >
        <template #header>
          <h3
            class="collapse-header"
          >
            {{ $kaanna(osaAlue.nimi) }}
          </h3>
        </template>

        <EpOsaAlue :model-value="osaAlue">
          <template #nimi>
            <div />
          </template>
          <template #tasokuvaus-postfix>
            <hr>
          </template>
        </EpOsaAlue>
      </EpCollapse>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, computed } from 'vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpOsaAlue from '@shared/components/EpOsaamiskokonaisuus/EpOsaAlue.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpToggleGroup from '@shared/components/forms/EpToggleGroup.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { useRoute } from 'vue-router';
import EpFormGroup from '@shared/components/forms/EpFormGroup.vue';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.osaamiskokonaisuusPaaAlueId);

const selectedTasot = ref(['varhaiskasvatus', 'esiopetus', 'vuosiluokka_12', 'vuosiluokka_3456', 'vuosiluokka_789']);

const current = computed(() => {
  return perusteDataStore.current || null;
});

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa as any;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const currentRoute = computed(() => {
  return perusteDataStore.currentRoute;
});

const osaAlueet = computed(() => {
  return _.map(perusteenOsa.value.osaAlueet, osaAlue => {
    return {
      ...osaAlue,
      tasokuvaukset: _.filter(osaAlue.tasokuvaukset, tasokuvaus => selectedTaso(tasokuvaus.taso)),
    };
  });
});

const tasot = computed(() => {
  return _.chain(perusteenOsa.value.osaAlueet)
    .map('tasokuvaukset')
    .flatMap()
    .map(tasokuvaus => _.toLower(tasokuvaus.taso))
    .uniq()
    .value();
});

const selectedTaso = (taso) => {
  return selectedTasot.value.includes(_.toLower(taso));
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
}

:deep(.collapse-button) {
  background-color: $digitaalinen-osaaminen-color;
  padding: 0.3rem 0.6rem;
  margin-bottom: 16px;
}

.collapse-header {
  margin: 0;
}

.taso-group {
  :deep(.checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  :deep(.checkbox-item) {
    padding: 0.3rem 0.8rem;
    border-radius: 10px;
    background-color: $digitaalinen-osaaminen-ikaryhma-color;
    border: 1px solid $digitaalinen-osaaminen-ikaryhma-color;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.9;
    }

    .ep-toggle {
      gap: 0;
    }

    .p-checkbox {
      display: none;
    }

    .toggle-label {
      margin: 0;
    }

    .taso-label {
      display: flex;
      align-items: center;
      color: white;
    }
  }
}

:deep(.osa-alue) {
  .edelleen-kehittyva-osaaminen {
    .otsikko {
      display: none;
    }

    .sisalto {
      font-style: italic;
    }
  }

  .edelleen-kehittyva-osaaminen + .osaaminen {
    margin-top: 0 !important;
  }

  .osaaminen {
    .otsikko {
      display: none;
    }
  }
}

</style>

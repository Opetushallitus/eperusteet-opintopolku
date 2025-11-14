<template>
  <div>
    <slot />
    <p class="kuvaus">
      {{ $t('kooste-kuvaus-valmisteilla-olevat-perusteet') }}
    </p>

    <ep-spinner v-if="!perusteet" />
    <template v-else>
      <div
        v-for="peruste in perusteetMapped"
        :key="'peruste'+peruste.id"
        class="valmisteilla-row m-2"
      >
        <div class="d-flex m-2">
          <div class="valmisteilla-data pl-2">
            <div class="nimi">
              {{ $kaanna(peruste.nimi) }}
            </div>
            <div class="d-flex">
              <div
                v-if="peruste.voimassaoloAlkaa"
                class="voimaantulo pr-1"
              >
                {{ $t('peruste-astuu-voimaan') }} {{ $sd(peruste.voimassaoloAlkaa) }}.
              </div>
              <div @click="toggle(peruste)">
                <div
                  v-if="peruste.toggled"
                  class="avaa-link btn-link"
                >
                  {{ $t('piilota-aikataulu') }}
                </div>
                <div
                  v-else
                  class="avaa-link btn-link"
                >
                  {{ $t('nayta-aikataulu') }}
                </div>
              </div>
            </div>
          </div>
          <div class="ml-auto align-self-start">
            <EpMaterialIcon v-if="peruste.toggled">
              expand_less
            </EpMaterialIcon>
            <EpMaterialIcon v-else>
              expand_more
            </EpMaterialIcon>
          </div>
        </div>

        <div
          v-if="peruste.toggled"
          class="footer mt-3 ml-3 mr-3"
        >
          <div
            v-for="(aikataulu, index) in peruste.perusteenAikataulut"
            :key="'aikataulu'+aikataulu.id"
            class="row perusteen-aikataulu"
          >
            <div class="col col-auto center-block mb-4 pl-4 pr-0">
              <div class="paiva d-inline-block text-center">
                {{ $sdm(aikataulu.tapahtumapaiva) }}
              </div>
              <div
                v-if="index != peruste.perusteenAikataulut.length - 1"
                class="aikajana"
              >
&nbsp;
              </div>
            </div>

            <div class="col pl-4">
              <div class="aikataulu px-3 py-2 mb-3">
                <div class="tavoite">
                  {{ $kaanna(aikataulu.tavoite) }}
                </div>
                <div class="voimaantulo">
                  {{ $sd(aikataulu.tapahtumapaiva) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EpBPagination
        v-model="page"
        :items-per-page="perPage"
        :total="total"
        aria-controls="perusteet-lista"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import * as _ from 'lodash';
import { pinia } from '@/pinia';

const valmisteillaOlevatStore = useValmisteillaOlevatStore(pinia);

const query = ref({
  sivu: 0,
  sivukoko: 10,
  koulutustyyppit: AmmatillisetKoulutustyypit,
});

const toggled = ref<number[]>([]);

onMounted(async () => {
  await fetch();
});

const fetch = async () => {
  await valmisteillaOlevatStore.fetch(query.value.sivu, query.value.sivukoko, query.value.koulutustyyppit);
};

watch(() => query.value, () => {
  page.value = 1;
});

const perusteet = computed(() => {
  return valmisteillaOlevatStore.perusteet;
});

const perusteetMapped = computed(() => {
  return _.map(perusteet.value!.data, peruste => {
    return {
      ...peruste,
      toggled: _.includes(toggled.value, peruste.id),
      perusteenAikataulut: _.sortBy(_.filter(peruste.perusteenAikataulut, 'julkinen'), 'tapahtumapaiva'),
    };
  });
});

const toggle = (peruste) => {
  if (_.includes(toggled.value, peruste.id)) {
    toggled.value = _.filter(toggled.value, id => id !== peruste.id);
  }
  else {
    toggled.value = [
      ...toggled.value,
      peruste.id,
    ];
  }
};

const total = computed(() => {
  return perusteet.value!.kokonaismäärä;
});

const pages = computed(() => {
  return perusteet.value!.sivuja;
});

const perPage = computed(() => {
  return perusteet.value!.sivukoko;
});

const page = computed({
  get: () => {
    return perusteet.value!.sivu + 1;
  },
  set: (value) => {
    query.value.sivu = value - 1;
    fetch();
  },
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.kuvaus {
  font-size: small;
  color: $black;
}

.valmisteilla-row {
  border-radius: 0;
  border: 1px solid rgb(232, 232, 233);

  .valmisteilla-data {
    border-left: 3px solid $green-lighten-2;
  }

  .avaa-link {
    font-size: 0.8rem;
  }
}

.nimi {
  font-size: normal;
  font-weight: bolder;
  margin-bottom: 8px;
}

.voimaantulo {
  font-size: 0.8rem;
  color: $gray;
}

.aikataulu {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  .tavoite {
    font-size: 0.9rem;
    font-weight: 600;
  }
}

.paiva {
  font-size: 0.6rem;
  width:45px;
  border-radius: 30px;
  padding: 10px;
  box-shadow: 1px 1px 5px 0 rgba(0,26,88,0.1);
  z-index: 15;
  background-color: #fff;
  color: $black;
}

.aikajana {
  z-index: 10;
  height: 100%;
  background: linear-gradient($gray-lighten-4, $gray-lighten-4) no-repeat center/2px 100%;
}
</style>

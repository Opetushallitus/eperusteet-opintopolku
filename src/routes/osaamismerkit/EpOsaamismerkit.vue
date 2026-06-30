<template>
  <div>
    <EpSpinner v-if="!osaamismerkit || !osaamismerkkiKategoriat" />
    <div v-else-if="osaamismerkit.length === 0">
      <div class="alert alert-info">
        {{ $t('ei-hakutuloksia') }}
      </div>
    </div>
    <div v-else>
      <div
        v-for="(group, index) in kategoriaGroup"
        :key="index"
        class="mb-4"
      >
        <div class="mb-4">
          <h4>{{ $kaanna(group.nimi) }}</h4>
        </div>
        <div
          v-if="group.kuvaus && !hideKuvaus"
          class="mb-4"
        >
          {{ $kaanna(group.kuvaus) }}
        </div>
        <div class="md:flex flex-wrap justify-start">
          <div
            v-for="(osaamismerkki, idx) in group.osaamismerkit"
            :key="'merkki-'+idx"
            class="mb-2 mr-2"
          >
            <router-link :to="{ name: 'osaamismerkkiTiedot', params: { osaamismerkkiId: osaamismerkki.id } }">
              <div
                class="tile tile-background-shadow-selected shadow-tile"
                :class="{ 'expand-voimassaolo': osaamismerkki.isVanhentunut }"
              >
                <div class="tile-main flex">
                  <div class="image">
                    <img
                      :src="osaamismerkki.image"
                      width="40"
                      height="40"
                    >
                  </div>
                  <div class="ml-3 nimi">
                    <span class="">{{ $kaanna(osaamismerkki.nimi) }}</span>
                  </div>
                </div>
                <hr v-if="osaamismerkki.isVanhentunut">
                <div
                  v-if="osaamismerkki.isVanhentunut"
                  class="tile-voimassaolo flex"
                >
                  <span>{{ $t('voimassaolo') }}:</span>
                  <EpVoimassaolo :voimassaolo="osaamismerkki" />
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import { OsaamismerkkiBaseDto, OsaamismerkkiKategoriaDto } from '@shared/generated/eperusteet';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  osaamismerkit: {
    type: Array as () => OsaamismerkkiBaseDto[],
    required: true,
  },
  osaamismerkkiKategoriat: {
    type: Array as () => OsaamismerkkiKategoriaDto[],
    required: true,
  },
  hideKuvaus: {
    type: Boolean,
    default: false,
  },
});

const generateImageUrl = (liite) => {
  return liite ? 'data:' + liite.mime + ';base64,' + liite.binarydata : null;
};

const isVanhentunut = (osaamismerkki) => {
  let currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  return osaamismerkki.voimassaoloLoppuu && _.toNumber(osaamismerkki.voimassaoloLoppuu) < currentDate.getTime();
};

const osaamismerkitMapped = computed(() => {
  if (props.osaamismerkit) {
    return _.chain(props.osaamismerkit)
      .filter(osaamismerkki => !!osaamismerkki?.nimi && !!osaamismerkki.nimi[Kielet.getSisaltoKieli.value])
      .map(osaamismerkki => ({
        ...osaamismerkki,
        image: generateImageUrl(osaamismerkki.kategoria?.liite),
        isVanhentunut: isVanhentunut(osaamismerkki),
      }))
      .sortBy(om => Kielet.sortValue(om.nimi))
      .value();
  }
  return [];
});

const kategoriaGroup = computed(() => {
  return _.chain(props.osaamismerkkiKategoriat)
    .sortBy(kategoria => $kaanna(kategoria.nimi))
    .map(kategoria => ({
      ...kategoria,
      osaamismerkit: _.filter(osaamismerkitMapped.value, osaamismerkki => osaamismerkki.kategoria?.id === kategoria.id),
    }))
    .filter(kategoria => kategoria.osaamismerkit.length > 0)
    .value();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tile {
  color: #212529;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  overflow: hidden;
  width: 390px;
  align-items: center;

  @media(max-width: 767.98px) {
    width: 100%;
  }

  .image {
    align-self: center;
  }

  .tile-main {
    height: 75px;
    padding: 20px;
  }

  .tile-voimassaolo {
    padding: 3px 20px 0 20px;
  }

  .nimi {
    align-self: center;
    font-size: 18px;
    font-weight: 600;
  }
}

.expand-voimassaolo {
  height: 110px;
}

hr {
  margin-top: 0;
  margin-bottom: 0;
}
</style>

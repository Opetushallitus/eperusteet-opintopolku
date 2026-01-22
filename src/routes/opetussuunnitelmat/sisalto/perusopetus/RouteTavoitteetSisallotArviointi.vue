<template>
  <div class="content">
    <EpSpinner v-if="!vuosiluokat" />
    <template v-else>
      <h2>{{ $t('tavoitteet-sisallot-ja-arviointi') }}</h2>

      <div
        v-if="vuosiluokat.length > 0"
        v-html="$t('tavoitteet-sisallot-ja-arviointi-ohje')"
      />

      <div
        class="row mt-4"
        :class="{'disabled-events': vuosiluokat.length === 0}"
      >
        <ep-form-content
          name="vuosiluokka"
          class="col-12 col-lg-3 mr-3"
        >
          <EpMultiSelect
            v-model="vuosiluokka"
            :enable-empty-option="true"
            :placeholder="$t('valitse') + '...'"
            :is-editing="true"
            :options="vuosiluokat"
            :searchable="false"
          >
            <template
              #singleLabel="{ option }"
            >
              {{ $t(option + '-luokka') }}
            </template>
            <template
              #option="{ option }"
            >
              {{ $t(option + '-luokka') }}
            </template>
          </EpMultiSelect>
        </ep-form-content>

        <ep-form-content
          name="oppiaine"
          class="col-12 col-lg-6"
        >
          <EpMultiSelect
            v-model="oppiaine"
            :disabled="!vuosiluokka"
            :enable-empty-option="true"
            :placeholder="$t('valitse') + '...'"
            :is-editing="true"
            :options="oppiaineValinnat"
            :search-identity="searchIdentity"
          >
            <template
              #singleLabel="{ option }"
            >
              {{ $kaanna(option.nimi) }}
            </template>
            <template
              #option="{ option }"
            >
              <span :class="{'ml-3': option.isOppimaara}">{{ $kaanna(option.nimi) }}</span>
            </template>
          </EpMultiSelect>
        </ep-form-content>
      </div>

      <div
        v-if="vuosiluokat.length === 0"
        class="mt-4"
      >
        <span class="font-italic">{{ $t('tavoitteet-sisallot-ja-arviointi-ei-vuosiluokkia') }}</span>
      </div>

      <ep-form-content
        v-if="oppiaine"
        name="tavoitteen-osiot"
        class="mt-4"
      >
        <EpToggleGroup
          v-model="osiot"
          :items="osioValinnat"
        >
          <template #default="{ item }">
            {{ $t(item) }}
          </template>
        </EpToggleGroup>
      </ep-form-content>

      <hr
        v-if="vuosiluokka"
        class="mt-4"
      >

      <template v-if="!oppiaine && vuosiluokka">
        <h3 class="mt-4 mb-3">
          {{ $t(vuosiluokka + '-luokka') }}
        </h3>

        <OppiaineenVuosiluokkaTiivistetty
          v-for="oppiaineJaTavoitteet in oppiaineidenVuosiluokkienTavoitteet"
          :key="oppiaineJaTavoitteet.oppiaine.id"
          class="mb-4"
          :oppiaine-ja-tavoitteet="oppiaineJaTavoitteet"
          @select-oppiaine="selectOppiaine"
        />
      </template>

      <template v-if="oppiaine && vuosiluokka">
        <div class="flex justify-content-between items-center">
          <h3 class="mb-0">
            <span
              class="link-style clickable"
              @click="oppiaine = null"
            >{{ $t(vuosiluokka + '-luokka') }}</span>
            / {{ $kaanna(oppiaine.nimi) }}
          </h3>

          <div id="sulje-kaikki-tavoitteet-portal" />
        </div>

        <oppiaineen-vuosiluokka
          :oppiaineen-vuosiluokka="oppiaineenVuosiluokka"
          :valinnainen="oppiaine.tyyppi === 'muu_valinnainen'"
          :kuvat="kuvat"
          :termit="termit"
          :nayta-sisaltoalueet="naytaSisaltoalueet"
          :nayta-arviointikriteerit="naytaArviointikriteerit"
          :nayta-laaja-alaiset-osaamiset="naytaLaajaAlaisetOsaamiset"
          avaa-sulje-siirrettavissa
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import OppiaineenVuosiluokka from './OppiaineenVuosiluokka.vue';
import OppiaineenVuosiluokkaTiivistetty from './OppiaineenVuosiluokkaTiivistetty.vue';
import { oppiaineenVuosiluokkakokonaisuudenRakennin } from './vuosiluokka';
import { $kaanna } from '@shared/utils/globals';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToggleGroup from '@shared/components/forms/EpToggleGroup.vue';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const route = useRoute();
const router = useRouter();
const osiot = ref<string[]>([]);

const vuosiluokka = computed({
  get: () => {
    return route.params.vuosiluokka;
  },
  set: (value) => {
    router.push({ params: { ...route.params, vuosiluokka: value, oppiaineId: null } });
  },
});

const oppiaine = computed({
  get: () => {
    return route.params.oppiaineId ? _.find(oppiaineetJaOppimaarat.value, { id: _.toNumber(route.params.oppiaineId) }) : null;
  },
  set: (value) => {
    router.push({
      name: route.name,
      params: {
        ...route.params,
        oppiaineId: value?.id,
      },
    });
  },
});

const selectOppiaine = (oppiaine) => {
  router.push({ params: { ...route.params, oppiaineId: oppiaine?.id } });
};

const osioValinnat = computed(() => {
  return ['sisaltoalueet', 'arviointikriteerit', 'laaja-alaisen-osaamisen-alueet'];
});

const naytaSisaltoalueet = computed(() => {
  return osiot.value.length === 0 || osiot.value.includes('sisaltoalueet');
});

const naytaArviointikriteerit = computed(() => {
  return osiot.value.length === 0 || osiot.value.includes('arviointikriteerit');
});

const naytaLaajaAlaisetOsaamiset = computed(() => {
  return osiot.value.length === 0 || osiot.value.includes('laaja-alaisen-osaamisen-alueet');
});

const opetussuunnitelmanOppiaineet = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto('oppiaineet');
});

const perusteenOppiaineetByTunniste = computed(() => {
  return _.chain(opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.oppiaineet'))
    .map(oppiaine => {
      return [
        oppiaine,
        ...(oppiaine.oppimaarat ? oppiaine.oppimaarat : []),
      ];
    })
    .flatten()
    .keyBy('tunniste')
    .value();
});

const opetussuunnitelmanVuosiluokkakokonaisuudet = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto('vuosiluokkakokonaisuudet');
});

const vuosiluokat = computed(() => {
  return _.chain(_.map(opetussuunnitelmaDataStore.getJulkaistuSisalto('oppiaineet'), 'oppiaine'))
    .map('vuosiluokkakokonaisuudet')
    .flatMap()
    .filter(vlk => _.includes(_.map(opetussuunnitelmanVuosiluokkakokonaisuudet.value, 'vuosiluokkakokonaisuus._tunniste'), _.get(vlk, '_vuosiluokkakokonaisuus')))
    .map('vuosiluokat')
    .flatMap()
    .map('vuosiluokka')
    .flatMap()
    .uniq()
    .sort()
    .value();
});

const oppiaineetJaOppimaarat = computed(() => {
  if (vuosiluokka.value) {
    const oppiaineet = [..._.sortBy(_.sortBy(opetussuunnitelmanOppiaineet.value, opsoppiaine => $kaanna(opsoppiaine.oppiaine.nimi)), 'jnro')];
    return _.chain(oppiaineet)
      .map(opsoppiaine => {
        return [
          {
            ...opsoppiaine.oppiaine,
            jnro: opsoppiaine.jnro,
          },
          ..._.chain(opsoppiaine.oppiaine.oppimaarat)
            .map(oppimaara => {
              return {
                ...oppimaara,
                isOppimaara: true,
              };
            })
            .sortBy(oppimaara => $kaanna(oppimaara.nimi))
            .value(),
        ];
      })
      .flatten()
      .filter(oppiaine => _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: vuosiluokka.value }))
        || _.some(oppiaine.oppimaarat, oppimaara => _.find(oppimaara.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: vuosiluokka.value }))))
      .value();
  }

  return [];
});

const oppiaineValinnat = computed(() => {
  return _.map(oppiaineetJaOppimaarat.value, oppiaine => {
    return {
      ...oppiaine,
      $isDisabled: !_.find(oppiaineidenVuosiluokkienTavoitteet.value, { oppiaine: oppiaine })?.vuosiluokka,
    };
  });
});

const oppiaineenVuosiluokkakokonaisuus = computed(() => {
  if (oppiaine.value && vuosiluokka.value) {
    return _.find(oppiaine.value.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: vuosiluokka.value }));
  }
  return undefined;
});

const findOpetussuunnitelmanVuosiluokkakokonaisuus = (oppiaineenVuosiluokkakokonaisuus) => {
  return _.get(_.find(opetussuunnitelmanVuosiluokkakokonaisuudet.value,
    vlk => _.get(vlk.vuosiluokkakokonaisuus, '_tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus')),
  'vuosiluokkakokonaisuus');
};

const opetussuunnitelmanVuosiluokkakokonaisuus = computed(() => {
  return findOpetussuunnitelmanVuosiluokkakokonaisuus(oppiaineenVuosiluokkakokonaisuus.value);
});

const laajaalaisetOsaamiset = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset');
});

const perusteenVuosiluokkakokonaisuudet = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.vuosiluokkakokonaisuudet');
});

const perusteenVuosiluokkakokonaisuus = computed(() => {
  return _.find(perusteenVuosiluokkakokonaisuudet.value,
    vlk => _.get(vlk, 'tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus.value, '_vuosiluokkakokonaisuus'));
});

const perusteOppiaine = computed(() => {
  if (oppiaine.value) {
    return perusteenOppiaineetByTunniste.value[oppiaine.value.tunniste];
  }
  return undefined;
});

const findPerusteOppiaineenVuosiluokkakokonaisuudet = (perusteOppiaine) => {
  return _.map(perusteOppiaine?.vuosiluokkakokonaisuudet, ovlk => {
    return {
      ...ovlk,
      tunniste: _.get(_.find(perusteenVuosiluokkakokonaisuudet.value,
        pvlk => _.toString(pvlk.id) === _.get(ovlk, '_vuosiluokkaKokonaisuus')), 'tunniste'),
    };
  });
};

const perusteOppiaineVuosiluokkakokonaisuudet = computed(() => {
  return findPerusteOppiaineenVuosiluokkakokonaisuudet(perusteOppiaine.value);
});

const findPerusteenOppiaineenVuosiluokkakokonaisuus = (perusteOppiaine, vuosiluokkakokonaisuus) => {
  return _.find(findPerusteOppiaineenVuosiluokkakokonaisuudet(perusteOppiaine),
    vlk => vlk?.tunniste === (vuosiluokkakokonaisuus as any)?._tunniste);
};

const perusteenOppiaineenVuosiluokkakokonaisuus = computed(() => {
  return findPerusteenOppiaineenVuosiluokkakokonaisuus(perusteOppiaine.value, opetussuunnitelmanVuosiluokkakokonaisuus.value);
});

const oppiaineenPohjanVuosiluokkakokonaisuudet = computed(() => {
  return oppiaine.value?.pohjanOppiaine?.vuosiluokkakokonaisuudet;
});

const oppiaineenPohjanVuosiluokkakokonaisuus = computed(() => {
  return _.find(oppiaineenPohjanVuosiluokkakokonaisuudet.value,
    ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(opetussuunnitelmanVuosiluokkakokonaisuus.value, '_tunniste'));
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
});

const oppiaineenVuosiluokkakokonaisuusPerusteDatoilla = computed(() => {
  if (oppiaine.value && vuosiluokka.value) {
    const oppiaineenVuosiluokkakokonaisuusPerusteDatoilla = oppiaineenVuosiluokkakokonaisuudenRakennin(
      oppiaine.value,
      perusteOppiaine.value,
      laajaalaisetOsaamiset.value,
      oppiaineenVuosiluokkakokonaisuus.value,
      opetussuunnitelmanVuosiluokkakokonaisuus.value,
      perusteenOppiaineenVuosiluokkakokonaisuus.value,
      oppiaineenPohjanVuosiluokkakokonaisuus.value,
      perusteenVuosiluokkakokonaisuus.value,
    );
    return _.keyBy(_.get(oppiaineenVuosiluokkakokonaisuusPerusteDatoilla, 'oppiaineenVuosiluokkakokonaisuus.vuosiluokat'), 'vuosiluokka');
  }

  return {};
});

const oppiaineenVuosiluokka = computed(() => {
  if (oppiaine.value && vuosiluokka.value) {
    return _.chain(oppiaine.value.vuosiluokkakokonaisuudet)
      .map('vuosiluokat')
      .flatMap()
      .find(vlk => vlk.vuosiluokka === vuosiluokka.value)
      .thru(vuosiluokka => oppiaineenVuosiluokkakokonaisuusPerusteDatoilla.value
        ? oppiaineenVuosiluokkakokonaisuusPerusteDatoilla.value[vuosiluokka.vuosiluokka] : vuosiluokka)
      .value();
  }
  return undefined;
});

const oppiaineidenVuosiluokkienTavoitteet = computed(() => {
  if (vuosiluokka.value) {
    return _.chain(oppiaineetJaOppimaarat.value)
      .map(oppiaine => {
        const perusteOppiaine = perusteenOppiaineetByTunniste.value[oppiaine.tunniste];
        const oppiaineenVlk = _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: vuosiluokka.value }));
        const opsVlk = findOpetussuunnitelmanVuosiluokkakokonaisuus(oppiaineenVlk);
        const perusteenOppiaineenVlk = findPerusteenOppiaineenVuosiluokkakokonaisuus(perusteOppiaine, opsVlk);
        const vlk = _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: vuosiluokka.value }));
        const perusteenVuosiluokkakokonaisuus = _.find(perusteenVuosiluokkakokonaisuudet.value,
          perusteVlk => _.get(perusteVlk, 'tunniste') === _.get(vlk, 'tunniste'));
        const oppiaineenPohjanVuosiluokkakokonaisuus = _.find(oppiaine?.pohjanOppiaine?.vuosiluokkakokonaisuudet,
          ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(opsVlk, '_tunniste'));
        const oppiaineenVuosiluokkakokonaisuusDatat = oppiaineenVuosiluokkakokonaisuudenRakennin(
          oppiaine,
          perusteOppiaine,
          laajaalaisetOsaamiset.value,
          vlk,
          opsVlk,
          perusteenOppiaineenVlk,
          oppiaineenPohjanVuosiluokkakokonaisuus,
          perusteenVuosiluokkakokonaisuus,
        );
        const vuosiluokat = _.keyBy(_.get(oppiaineenVuosiluokkakokonaisuusDatat, 'oppiaineenVuosiluokkakokonaisuus.vuosiluokat'), 'vuosiluokka');
        return {
          oppiaine,
          vuosiluokka: vuosiluokat[vuosiluokka.value!],
        };
      })
      .filter(oppiaineJaTavoitteet => oppiaineJaTavoitteet.vuosiluokka)
      .value();
  }
  return [];
});

const searchIdentity = (oppiaine: any) => {
  return _.toLower($kaanna(oppiaine.nimi) as any);
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content{
  padding: 0 $content-padding;
}

.row {
  margin-left: 0;
}

:deep(.form-content) {
  margin-bottom: 0px;
}

:deep(.ep-button .btn){
  padding: 0;
}
</style>

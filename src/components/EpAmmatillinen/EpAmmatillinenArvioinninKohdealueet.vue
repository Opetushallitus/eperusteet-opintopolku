<template>
  <ep-form-content
    class="col-md-12"
    name="arviointi"
  >
    <div
      v-for="(arvioinninKohdealue, index) in arvioinninKohdealueetFilled"
      :key="'aka'+index"
      class="mb-5"
    >
      <div class="kohdealueotsikko mt-3">
        {{ $kaanna(arvioinninKohdealue.otsikko) }}
      </div>

      <div
        v-for="(arvioinninkohde, index) in arvioinninKohdealue.arvioinninKohteet"
        :key="'arvioinninkohde'+index"
        class="mb-5"
      >
        <div class="mb-2 mt-4">
          <div class="font-bold mb-3">
            {{ $kaanna(arvioinninkohde.otsikko) }}
          </div>
          <div>{{ $kaanna(arvioinninkohde.selite) }}</div>
        </div>

        <EpTable
          striped
          :items="arvioinninkohde.osaamistasonKriteerit"
          :fields="osaamistasonKriteeritFields"
          responsive
          :show-headers="false"
        >
          <template #cell(osaamistaso)="{item}">
            <span v-if="item.osaamistaso"> {{ $kaanna(item.osaamistaso.otsikko) }}</span>
          </template>

          <template #cell(kriteerit)="{item}">
            <ul>
              <li
                v-for="(kriteeri, index) in item.kriteerit"
                :key="'kriteeri'+index"
              >
                {{ $kaanna(kriteeri) }}
              </li>
            </ul>
          </template>
        </EpTable>
      </div>
    </div>

    <slot />
  </ep-form-content>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import * as _ from 'lodash';
import EpTable from '@shared/components/EpTable/EpTable.vue';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  arvioinninKohdealueet: {
    type: Array,
    required: true,
  },
  arviointiasteikot: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const getArviointiasteikko = (arvioinninkohde) => {
  if (arvioinninkohde._arviointiAsteikko || arvioinninkohde._arviointiasteikko) {
    const arviointiasteikkoId = arvioinninkohde._arviointiAsteikko || arvioinninkohde._arviointiasteikko;
    const arviointiAsteikko = _.keyBy(props.arviointiasteikot, 'id')[arviointiasteikkoId];

    return arviointiAsteikko;
  }

  return arvioinninkohde.arviointiasteikko;
};

const arvioinninKohdealueetFilled = computed(() => {
  return _.map(props.arvioinninKohdealueet, arvKohdealue => {
    return {
      ...arvKohdealue,
      arvioinninKohteet: _.map(arvKohdealue.arvioinninKohteet, arvioinninKohde => {
        const osaamistasot = _.keyBy(getArviointiasteikko(arvioinninKohde).osaamistasot, 'id');
        return {
          ...arvioinninKohde,
          osaamistasonKriteerit: _.sortBy(_.map(arvioinninKohde.osaamistasonKriteerit, osaamistasonKriteeri => {
            return {
              ...osaamistasonKriteeri,
              osaamistaso: osaamistasot[osaamistasonKriteeri._osaamistaso],
            };
          }), '_osaamistaso'),
        };
      }),
    };
  });
});

const osaamistasonKriteeritFields = computed(() => {
  return [{
    key: 'osaamistaso',
    thStyle: { width: '40%' },
  }, {
    key: 'kriteerit',
  }] as any[];
});
</script>

<style scoped lang="scss">

  .kohdealueotsikko {
    font-weight: 600;
  }

</style>

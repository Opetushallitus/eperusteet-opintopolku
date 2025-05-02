<template>
  <div>
    <ep-form-content
      v-if="tutkinnonosa.koodiArvo"
      class="col-md-12"
      name="koodi"
    >
      <span v-html="tutkinnonosa.koodiArvo" />
    </ep-form-content>

    <ep-form-content
      v-if="tutkinnonosa.kuvaus"
      class="col-md-12 mb-5"
      :show-header="false"
    >
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content
      v-if="tutkinnonosa.osaAlueet && osaAlueet.length > 0"
      class="col-md-12 mb-5"
      name="osa-alueet"
      header-type="h3"
    >
      <ep-ammatillinen-osaalueet
        :arviointiasteikot="arviointiasteikot"
        :osaalueet="osaAlueet"
      />
    </ep-form-content>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmatillinenOsaalueet from '@/components/EpAmmatillinen/EpAmmatillinenOsaalueet.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

const props = defineProps({
  tutkinnonosa: {
    type: Object,
    required: true,
  },
  arviointiasteikot: {
    type: Array,
    required: true,
  },
  perusteenKielet: {
    type: Array,
    required: false,
  },
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const osaAlueet = computed(() => {
  return _.filter(props.tutkinnonosa.osaAlueet, osaalue => !!osaalue.nimi[sisaltoKieli.value]);
});
</script>

<style scoped lang="scss">

</style>

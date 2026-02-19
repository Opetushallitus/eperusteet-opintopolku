<template>
  <div>
    <div
      v-if="sisalto.tutkintonimikkeet && sisalto.tutkintonimikkeet.length > 0"
      class="nimikkeet flex"
    >
      <div class="kohde mr-1">
        {{ $t('tutkintonimikkeet') }}:
      </div>
      <div>
        <div
          v-for="(tutkintonimike, tidx) in sisalto.tutkintonimikkeet"
          :key="tidx"
          class="inline-block mr-1"
        >
          {{ $kaanna(tutkintonimike.nimi) }}<span v-if="tidx < sisalto.tutkintonimikkeet.length - 1">,</span>
        </div>
      </div>
    </div>
    <div
      v-if="sisalto.osaamisalat && sisalto.osaamisalat.length > 0"
      class="nimikkeet flex"
    >
      <div class="kohde mr-1">
        {{ $t('osaamisalat') }}:
      </div>
      <div>
        <div
          v-for="(osaamisala, oidx) in sisalto.osaamisalat"
          :key="oidx"
          class="inline-block mr-1"
        >
          {{ $kaanna(osaamisala.nimi) }}<span v-if="oidx < sisalto.osaamisalat.length - 1">,</span>
        </div>
      </div>
    </div>
    <div class="alatiedot">
      <span
        v-for="(voimassaolotieto, index) in sisalto.voimassaoloTieto"
        :key="'voimassa' + index"
      >
        <span v-if="index > 0">|</span>
        {{ $t(voimassaolotieto.teksti) }}: {{ $sd(voimassaolotieto.paiva) }}
      </span>
      <EpVoimassaolo :voimassaolo="sisalto" />
      <span v-if="sisalto.diaarinumero">| {{ $t('diaarinumero') }}: {{ sisalto.diaarinumero }}</span>
      <span v-if="sisalto.koulutukset && sisalto.koulutukset.length > 0">
        <template v-if="sisalto.koulutukset.length > 1">
          | {{ $t('koulutuskoodit') }}: {{ sisalto.koulutuskoodit }}
        </template>
        <template v-else>
          | {{ $t('koulutuskoodi') }}: {{ sisalto.koulutuskoodit }}
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';

const props = defineProps({
  sisalto: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">

.nimikkeet {
  font-size: small;
  padding-bottom: 5px;

  @media(max-width: 992px) {
    width: 100% !important;
    padding-bottom: 10px;
  }

  .kohde {
    font-weight: 600;
  }
}

.alatiedot {
  font-size: smaller;
}

</style>

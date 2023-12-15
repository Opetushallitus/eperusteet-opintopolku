<template>
  <div>
    <div class="nimikkeet w-80" v-if="sisalto.tutkintonimikkeet && sisalto.tutkintonimikkeet.length > 0">
      <span class="kohde">{{ $t('tutkintonimikkeet') }}:</span>
      <span v-for="(tutkintonimike, tidx) in sisalto.tutkintonimikkeet" :key="tidx">
      {{ $kaanna(tutkintonimike.nimi) }}
    </span>
    </div>
    <div class="nimikkeet w-80" v-if="sisalto.osaamisalat && sisalto.osaamisalat.length > 0">
      <span class="kohde">{{ $t('osaamisalat') }}:</span>
      <span v-for="(osaamisala, oidx) in sisalto.osaamisalat" :key="oidx">
      {{ $kaanna(osaamisala.nimi) }}
    </span>
    </div>
    <div class="alatiedot">
    <span v-for="(voimassaolotieto, index) in sisalto.voimassaoloTieto" :key="'voimassa' + index">
      <span v-if="index > 0">|</span>
      {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
    </span>
      <EpVoimassaolo :voimassaolo="sisalto"></EpVoimassaolo>
      <span v-if="sisalto.diaarinumero">| {{$t('diaarinumero')}}: {{ sisalto.diaarinumero }}</span>
      <span v-if="sisalto.koulutukset && sisalto.koulutukset.length > 0">
      <template v-if="sisalto.koulutukset.length > 1">
        | {{$t('koulutuskoodit')}}: {{ sisalto.koulutuskoodit }}
      </template>
      <template v-else>
        | {{$t('koulutuskoodi')}}: {{ sisalto.koulutuskoodit }}
      </template>
    </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';

@Component({
  components: {
    EpVoimassaolo,
  },
})
export default class EpAmmatillinenPerusteItem extends Vue {
  @Prop({ required: true })
  private sisalto!: any;
}
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

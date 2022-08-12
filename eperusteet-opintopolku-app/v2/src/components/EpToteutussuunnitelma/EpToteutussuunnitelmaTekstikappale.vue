<template>
  <div class="content">
    <h2>{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2>

    <ep-collapse tyyppi="perusteteksti" v-if="sisaltoviite.naytaPerusteenTeksti && sisaltoviite.perusteteksti">
      <div class="collapse-header" slot="header">{{ $t('perusteen-teksti') }}</div>
      <ep-content-viewer :value="$kaanna(sisaltoviite.perusteteksti)" :kuvat="kuvat"/>
    </ep-collapse>

    <ep-collapse tyyppi="pohjateksti" v-if="sisaltoviite.naytaPohjanTeksti && sisaltoviite.pohjanTekstikappale && sisaltoviite.pohjanTekstikappale.teksti">
      <div class="collapse-header" slot="header">
        {{ $t('pohjan-teksti') }}
        <span v-if="pohjaNimi">({{$kaanna(pohjaNimi)}})</span>
      </div>
      <ep-content-viewer :value="$kaanna(sisaltoviite.pohjanTekstikappale.teksti)" :kuvat="kuvat" />
    </ep-collapse>

    <ep-collapse tyyppi="paikallinen-teksti" :borderBottom="false" v-if="sisaltoviite.tekstiKappale.teksti">
      <div class="collapse-header" slot="header">{{ $t('paikallinen-teksti') }}</div>
      <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>
    </ep-collapse>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpContentViewer,
    EpCollapse,
  },
})
export default class EpToteutussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];
}
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

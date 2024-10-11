<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header"></portal-target>

    <ep-collapse tyyppi="perusteteksti" v-if="sisaltoviite.naytaPerusteenTeksti && sisaltoviite.perusteteksti">
      <div class="collapse-header" slot="header">{{ $t('perusteen-teksti') }}</div>
      <ep-content-viewer :value="$kaanna(sisaltoviite.perusteteksti)" :kuvat="kuvat"/>
    </ep-collapse>

    <ep-collapse tyyppi="pohjateksti" v-if="sisaltoviite.naytaPohjanTeksti && sisaltoviite.pohjanTekstikappale && sisaltoviite.pohjanTekstikappale.teksti">
      <div class="collapse-header" slot="header">
        {{ $t('pohjan-teksti') }}
      </div>
      <ep-content-viewer :value="$kaanna(sisaltoviite.pohjanTekstikappale.teksti)" :kuvat="kuvat" />
    </ep-collapse>

    <EpPaikallinenTarkennus v-if="sisaltoviite.tekstiKappale.teksti">
      <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>
    </EpPaikallinenTarkennus>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { NavigationNode } from '@shared/utils/NavigationBuilder';

@Component({
  components: {
    EpContentViewer,
    EpCollapse,
  },
})
export default class EpToteutussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  get current(): NavigationNode | null {
    return this.opetussuunnitelmaDataStore.current;
  }

  get numerointi() {
    return this.current?.meta?.numerointi;
  }

  get alikappaleNumeroinnitById() {
    if (this.current?.children) {
      return this.current?.children?.reduce((acc: any, child: any) => {
        acc[child.id] = child?.meta?.numerointi;
        return acc;
      }, {});
    }

    return {};
  }
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

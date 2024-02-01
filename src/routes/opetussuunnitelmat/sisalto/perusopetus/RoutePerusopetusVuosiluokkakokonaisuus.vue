<template>
  <div>
    <router-view v-if="oppiaine" />

    <div v-else class="content">
      <h2>{{$kaanna(vuosiluokkakokonaisuus.nimi)}}</h2>

      <ep-peruste-content
        :perusteObject="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="vuosiluokkakokonaisuus.tehtava"
      />

      <template v-if="perusteVlkVapaatTekstit">
        <div v-for="(vapaaTeksti, index) in perusteVlkVapaatTekstit" :key="'vapaateksti'+index" class="mt-5">
          <h4>{{$kaanna(vapaaTeksti.nimi)}}</h4>
          <EpContentViewer :value="$kaanna(vapaaTeksti.teksti)" :kuvat="kuvat" :termit="termit"/>

          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <div v-if="vapaaTeksti.vlkVapaaTeksti.paikallinenTarkennus">
            <EpContentViewer :value="$kaanna(vapaaTeksti.vlkVapaaTeksti.paikallinenTarkennus)" :kuvat="kuvat" :termit="termit"/>
          </div>
          <EpAlert v-else :text="$t('paikallista-sisaltoa-ei-maaritetty')" />
        </div>
      </template>

      <h2 class="mt-5" v-if="siirtymia">{{$t('siirtymavaiheet')}}</h2>

      <ep-peruste-content
        :perusteObject="perusteenVuosiluokkakokonaisuus.siirtymaEdellisesta"
        :object="vuosiluokkakokonaisuus.siirtymaEdellisesta"
      />

      <ep-peruste-content
        :perusteObject="perusteenVuosiluokkakokonaisuus.siirtymaSeuraavaan"
        :object="vuosiluokkakokonaisuus.siirtymaSeuraavaan"
      />

      <h2 class="mt-5" v-if="laajaaAlainenOsaaminen">{{$t('laaja-alainen-osaaminen')}}</h2>

      <ep-peruste-content
        :perusteObject="perusteenVuosiluokkakokonaisuus.laajaalainenOsaaminen"
        :object="vuosiluokkakokonaisuus.laajaalainenosaaminen"
      />

      <h2 class="mt-5">{{$t('laaja-alaisen-osaamisen-alueet')}}</h2>

      <ep-peruste-content
        v-for="(lao, index) in laajaalaisetOsaamiset" :key="'lao'+index"
        otsikko="nimi"
        teksti="kuvaus"
        :perusteObject="lao"
        :object="lao.opetussuunnitelmanLao"
        :naytaSisaltoTyhjana="false"
      />

    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';

@Component({
  components: {
    EpAlert,
    EpContentViewer,
    EpPerusteContent,
  },
})
export default class RoutePerusopetusVuosiluokkakokonaisuus extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get vlkId() {
    return _.toNumber(this.$route.params.vlkId);
  }

  get oppiaine() {
    return this.$route.params.oppiaineId;
  }

  get vuosiluokkakokonaisuus() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.vlkId });
  }

  get perusteenVuosiluokkakokonaisuus() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: this.vuosiluokkakokonaisuus._tunniste });
  }

  get laajaalaisetOsaamiset() {
    return _.chain(this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset'))
      .map(lao => {
        return {
          ...lao,
          opetussuunnitelmanLao: this.vuosiluokanLaot[lao.tunniste!],
        };
      })
      .sortBy(lao => this.$kaanna(lao.nimi))
      .value();
  }

  get siirtymia() {
    return (this.perusteenVuosiluokkakokonaisuus && (this.perusteenVuosiluokkakokonaisuus.siirtymaEdellisesta || this.perusteenVuosiluokkakokonaisuus.siirtymaSeuraavaan))
      || (this.vuosiluokkakokonaisuus && (this.vuosiluokkakokonaisuus.siirtymaEdellisesta || this.vuosiluokkakokonaisuus.siirtymaSeuraavaan));
  }

  get laajaaAlainenOsaaminen() {
    return (this.perusteenVuosiluokkakokonaisuus && this.perusteenVuosiluokkakokonaisuus.laajaalainenOsaaminen)
      || (this.vuosiluokkakokonaisuus && this.vuosiluokkakokonaisuus.laajaalainenosaaminen);
  }

  get vuosiluokanLaot() {
    return _.keyBy(this.vuosiluokkakokonaisuus.laajaalaisetosaamiset, '_laajaalainenosaaminen');
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.kaikkiTermit;
  }

  get perusteVlkVapaatTekstit() {
    return _.map(this.perusteenVuosiluokkakokonaisuus.vapaatTekstit, pVlkVt => {
      return {
        ...pVlkVt,
        vlkVapaaTeksti: _.find(this.vuosiluokkakokonaisuus.vapaatTekstit, vlkVt => _.toString(pVlkVt.id) === _.toString(vlkVt.perusteenVapaaTekstiId)) || {},
      };
    });
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

<template>
  <div>
    <router-view v-if="oppiaine" />

    <div v-else class="content">
      <h2>{{$kaanna(vuosiluokkakokonaisuus.nimi)}}</h2>

      <ep-peruste-content
        :perusteObject="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="vuosiluokkakokonaisuus.tehtava"
      />

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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { OpetussuunnitelmaVuosiluokkakokonaisuusStore } from '@/stores/OpetussuunnitelmaVuosiluokkakokonaisuusStore';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';

@Component({
  components: {
    EpPerusteContent,
  },
})
export default class RoutePerusopetusVuosiluokkakokonaisuus extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaVuosiluokkakokonaisuusStore!: OpetussuunnitelmaVuosiluokkakokonaisuusStore

  get oppiaine() {
    return this.$route.params.oppiaineId;
  }

  get vuosiluokkakokonaisuus() {
    return this.opetussuunnitelmaVuosiluokkakokonaisuusStore.vuosiluokkakokonaisuus.value;
  }

  get perusteenVuosiluokkakokonaisuus() {
    return this.opetussuunnitelmaVuosiluokkakokonaisuusStore.perusteenVuosiluokkakokonaisuus.value;
  }

  get laajaalaisetOsaamiset() {
    return this.opetussuunnitelmaVuosiluokkakokonaisuusStore.perusteenLaajaalaisetOsaamiset.value;
  }

  get siirtymia() {
    return (this.perusteenVuosiluokkakokonaisuus && (this.perusteenVuosiluokkakokonaisuus.siirtymaEdellisesta || this.perusteenVuosiluokkakokonaisuus.siirtymaSeuraavaan))
      || (this.vuosiluokkakokonaisuus && (this.vuosiluokkakokonaisuus.siirtymaEdellisesta || this.vuosiluokkakokonaisuus.siirtymaSeuraavaan));
  }

  get laajaaAlainenOsaaminen() {
    return (this.perusteenVuosiluokkakokonaisuus && this.perusteenVuosiluokkakokonaisuus.laajaalainenOsaaminen)
      || (this.vuosiluokkakokonaisuus && this.vuosiluokkakokonaisuus.laajaalainenosaaminen);
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

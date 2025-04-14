<template>
  <div>
    <router-view v-if="oppiaine" />

    <div
      v-else
      class="content"
    >
      <h2>{{ $kaanna(vuosiluokkakokonaisuus.nimi) }}</h2>

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.tehtava"
        :pohja-object="pohjanVuosiluokkakokonaisuus.tehtava"
        :object="vuosiluokkakokonaisuus.tehtava"
      />

      <template v-if="perusteVlkVapaatTekstit">
        <div
          v-for="(vapaaTeksti, index) in perusteVlkVapaatTekstit"
          :key="'vapaateksti'+index"
          class="mt-5"
        >
          <h4>{{ $kaanna(vapaaTeksti.nimi) }}</h4>
          <EpContentViewer
            :value="$kaanna(vapaaTeksti.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />

          <EpPaikallinenTarkennus
            v-if="vapaaTeksti.vlkVapaaTeksti.paikallinenTarkennus"
            headerh4
          >
            <EpContentViewer
              :value="$kaanna(vapaaTeksti.vlkVapaaTeksti.paikallinenTarkennus)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </EpPaikallinenTarkennus>
        </div>
      </template>

      <h2
        v-if="siirtymia"
        class="mt-5"
      >
        {{ $t('siirtymavaiheet') }}
      </h2>

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.siirtymaEdellisesta"
        :pohja-object="pohjanVuosiluokkakokonaisuus.siirtymaEdellisesta"
        :object="vuosiluokkakokonaisuus.siirtymaEdellisesta"
      />

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.siirtymaSeuraavaan"
        :pohja-object="pohjanVuosiluokkakokonaisuus.siirtymaSeuraavaan"
        :object="vuosiluokkakokonaisuus.siirtymaSeuraavaan"
      />

      <h2
        v-if="laajaaAlainenOsaaminen"
        class="mt-5"
      >
        {{ $t('laaja-alainen-osaaminen') }}
      </h2>

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.laajaalainenOsaaminen"
        :pohja-object="pohjanVuosiluokkakokonaisuus.laajaalainenOsaaminen"
        :object="vuosiluokkakokonaisuus.laajaalainenosaaminen"
      />

      <h2 class="mt-5">
        {{ $t('laaja-alaisen-osaamisen-alueet') }}
      </h2>

      <div
        v-for="(laajaalainen, index) in laajaalaisetOsaamiset"
        :key="index"
        class="mb-5"
      >
        <h3 class="mb-3">
          {{ $kaanna(laajaalainen.nimi) }}
        </h3>

        <ep-collapse
          v-if="laajaalainen.opetussuunnitelmanLao.naytaPerusteenPaatasonLao || laajaalainen.opetussuunnitelmanLao.naytaPerusteenVlkTarkennettuLao"
          tyyppi="perusteteksti"
          :border-bottom="false"
          :border-top="false"
          :use-padding="false"
          class="mb-4"
        >
          <template #header>
            <h4>{{ $t('perusteen-teksti') }}</h4>
          </template>
          <ep-content-viewer
            v-if="laajaalainen.opetussuunnitelmanLao.naytaPerusteenPaatasonLao"
            :value="$kaanna(laajaalainen.kuvaus)"
          />

          <template v-if="perusteenVlkByLaoId[laajaalainen.id] && laajaalainen.opetussuunnitelmanLao.naytaPerusteenVlkTarkennettuLao">
            <h5 v-if="laajaalainen.opetussuunnitelmanLao.naytaPerusteenPaatasonLao">
              {{ $t('laaja-alaisen-osaamisen-alueen-vuosiluokkakokonaisuuden-kuvaus') }}
            </h5>
            <ep-content-viewer :value="$kaanna(perusteenVlkByLaoId[laajaalainen.id].kuvaus)" />
          </template>
        </ep-collapse>

        <template
          v-if="laajaalainen.pohjanLao
            && laajaalainen.pohjanLao.kuvaus
            && (!laajaalainen.opetussuunnitelmanLao.kuvaus || $kaanna(laajaalainen.pohjanLao.kuvaus) !== $kaanna(laajaalainen.opetussuunnitelmanLao.kuvaus))"
        >
          <h4>{{ $kaanna(pohjaNimi) }}</h4>
          <ep-content-viewer :value="$kaanna(laajaalainen.pohjanLao.kuvaus)" />
        </template>

        <EpPaikallinenTarkennus
          v-if="laajaalainen.opetussuunnitelmanLao.kuvaus"
          headerh4
        >
          <ep-content-viewer :value="$kaanna(laajaalainen.opetussuunnitelmanLao.kuvaus)" />
        </EpPaikallinenTarkennus>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, InjectReactive } from 'vue-property-decorator';
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

  @InjectReactive('opetussuunnitelma')
  private opetussuunnitelma!: any;

  get vlkId() {
    return _.toNumber(this.$route.params.vlkId);
  }

  get oppiaine() {
    return this.$route.params.oppiaineId;
  }

  get vuosiluokkakokonaisuus() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.vlkId });
  }

  get pohjanVuosiluokkakokonaisuus() {
    const opsVlk = _.find(this.opetussuunnitelmaDataStore.getJulkaistuSisalto('vuosiluokkakokonaisuudet'), opsVlk => opsVlk?.pohjanVuosiluokkakokonaisuus?._tunniste === this.vuosiluokkakokonaisuus._tunniste);
    return (opsVlk && opsVlk.pohjanVuosiluokkakokonaisuus) ?? {};
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
          pohjanLao: this.pohjanVuosiluokanLaot[lao.tunniste!],
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

  get pohjanVuosiluokanLaot() {
    return _.keyBy(this.pohjanVuosiluokkakokonaisuus.laajaalaisetosaamiset, '_laajaalainenosaaminen');
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

  get perusteenVlkByLaoId() {
    return _.keyBy(_.map(this.perusteenVuosiluokkakokonaisuus.laajaalaisetOsaamiset, lao => {
      return {
        ...lao,
        _laajaalainenOsaaminen: Number(lao._laajaalainenOsaaminen),
      };
    }), '_laajaalainenOsaaminen');
  }

  get pohjaNimi() {
    return this.opetussuunnitelma?.pohja?.nimi;
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

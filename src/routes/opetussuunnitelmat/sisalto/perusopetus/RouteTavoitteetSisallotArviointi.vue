<template>
  <div class="content">
    <EpSpinner v-if="!vuosiluokat" />
    <template v-else>

      <h2>{{$t('tavoitteet-sisallot-ja-arviointi')}}</h2>

      <div class="row mt-4">
        <ep-form-content name="vuosiluokka" class="col-12 col-lg-3 mr-3">
          <EpMultiSelect v-model="vuosiluokka"
                  :enable-empty-option="true"
                  :placeholder="$t('valitse') + '...'"
                  :is-editing="true"
                  :options="vuosiluokat"
                  :searchable="false">
            <template slot="singleLabel" slot-scope="{ option }">
              {{ $t(option + '-luokka') }}
            </template>
            <template slot="option" slot-scope="{ option }">
              {{ $t(option + '-luokka') }}
            </template>
          </EpMultiSelect>
        </ep-form-content>

        <ep-form-content name="oppiaine" class="col-12 col-lg-6">
          <EpMultiSelect v-model="oppiaine"
                  :disabled="!vuosiluokka"
                  :enable-empty-option="true"
                  :placeholder="$t('valitse') + '...'"
                  :is-editing="true"
                  :options="oppiaineValinnat"
                  :search-identity="searchIdentity">
            <template slot="singleLabel" slot-scope="{ option }">
              {{ $kaanna(option.nimi) }}
            </template>
            <template slot="option" slot-scope="{ option }">
              <span :class="{'ml-3': option.isOppimaara}">{{ $kaanna(option.nimi) }}</span>
            </template>
          </EpMultiSelect>
        </ep-form-content>
      </div>

      <ep-form-content name="tavoitteen-osiot" class="mt-4" v-if="oppiaine">
        <b-form-checkbox-group v-model="osiot">
          <b-form-checkbox v-for="osio in osioValinnat" :key="'osio-' + osio" :value="osio">{{$t(osio)}}</b-form-checkbox>
        </b-form-checkbox-group>
      </ep-form-content>

      <hr class="mt-4" v-if="vuosiluokka"/>

      <template v-if="!oppiaine && vuosiluokka">
        <h3 class="mt-4 mb-3">{{$t(vuosiluokka + '-luokka')}}</h3>

        <OppiaineenVuosiluokkaTiivistetty
          v-for="oppiaineJaTavoitteet in oppiaineidenVuosiluokkienTavoitteet"
          class="mb-4"
          :key="oppiaineJaTavoitteet.oppiaine.id"
          :oppiaineJaTavoitteet="oppiaineJaTavoitteet"
          @selectOppiaine="selectOppiaine"/>
      </template>

      <template v-if="oppiaine && vuosiluokka">
        <h3 class="mt-4">
          <span class="link-style clickable" @click="oppiaine = null">{{$t(vuosiluokka + '-luokka')}}</span>
          / {{ $kaanna(oppiaine.nimi) }}
        </h3>

        <oppiaineen-vuosiluokka
          :oppiaineenVuosiluokka="oppiaineenVuosiluokka"
          :valinnainen="oppiaine.tyyppi === 'muu_valinnainen'"
          :kuvat="kuvat"
          :termit="termit"
          :naytaSisaltoalueet="naytaSisaltoalueet"
          :naytaArviointikriteerit="naytaArviointikriteerit"
          :naytaLaajaAlaisetOsaamiset="naytaLaajaAlaisetOsaamiset"/>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import OppiaineenVuosiluokka from './OppiaineenVuosiluokka.vue';
import OppiaineenVuosiluokkaTiivistetty from './OppiaineenVuosiluokkaTiivistetty.vue';
import { oppiaineenVuosiluokkakokonaisuudenRakennin } from './vuosiluokka';
import { UnwrappedOpsOppiaineDtoTyyppiEnum } from '@shared/api/ylops';

@Component({
  components: {
    OppiaineenVuosiluokka,
    OppiaineenVuosiluokkaTiivistetty,
  },
})
export default class RouteTavoitteetSisallotArviointi extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  osiot: string[] = [];

  get vuosiluokka() {
    return this.$route.params.vuosiluokka;
  }

  set vuosiluokka(vuosiluokka) {
    this.$router.push({ params: { ...this.$route.params, vuosiluokka, oppiaineId: null } as any });
  }

  get oppiaine() {
    return this.$route.params.oppiaineId ? _.find(this.oppiaineetJaOppimaarat, { id: _.toNumber(this.$route.params.oppiaineId) }) : null;
  }

  set oppiaine(oppiaine) {
    this.$router.push({ params: { ...this.$route.params, oppiaineId: oppiaine?.id } });
  }

  selectOppiaine(oppiaine) {
    this.oppiaine = oppiaine;
  }

  get osioValinnat() {
    return ['sisaltoalueet', 'arviointikriteerit', 'laaja-alaisen-osaamisen-alueet'];
  }

  get naytaSisaltoalueet() {
    return this.osiot.length === 0 || this.osiot.includes('sisaltoalueet');
  }

  get naytaArviointikriteerit() {
    return this.osiot.length === 0 || this.osiot.includes('arviointikriteerit');
  }

  get naytaLaajaAlaisetOsaamiset() {
    return this.osiot.length === 0 || this.osiot.includes('laaja-alaisen-osaamisen-alueet');
  }

  get opetussuunnitelmanOppiaineet() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('oppiaineet');
  }

  get oppiaineetJaOppimaarat() {
    if (this.vuosiluokka) {
      const oppiaineet = [..._.sortBy(_.sortBy(this.opetussuunnitelmanOppiaineet, opsoppiaine => this.$kaanna(opsoppiaine.oppiaine.nimi)), 'jnro')];
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
              .sortBy(oppimaara => this.$kaanna(oppimaara.nimi))
              .value(),
          ];
        })
        .flatten()
        .filter(oppiaine => _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }))
            || _.some(oppiaine.oppimaarat, oppimaara => _.find(oppimaara.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }))))
        .value();
    }

    return [];
  }

  get oppiaineValinnat() {
    return _.map(this.oppiaineetJaOppimaarat, oppiaine => {
      return {
        ...oppiaine,
        $isDisabled: !_.find(this.oppiaineidenVuosiluokkienTavoitteet, { oppiaine: oppiaine })?.vuosiluokka,
      };
    });
  }

  get vuosiluokat() {
    return _.chain(_.map(this.opetussuunnitelmaDataStore.getJulkaistuSisalto('oppiaineet'), 'oppiaine'))
      .map('vuosiluokkakokonaisuudet')
      .flatMap()
      .map('vuosiluokat')
      .flatMap()
      .map('vuosiluokka')
      .flatMap()
      .uniq()
      .sort()
      .value();
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    if (this.oppiaine && this.vuosiluokka) {
      return _.chain(this.oppiaineetJaOppimaarat)
        .filter(oppiaine => this.oppiaine!.tunniste! === oppiaine.tunniste)
        .map('vuosiluokkakokonaisuudet')
        .flatMap()
        .find(vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }))
        .value();
    }
  }

  get oppiaineenVuosiluokka() {
    if (this.oppiaine && this.vuosiluokka) {
      return _.chain(this.oppiaineetJaOppimaarat)
        .filter(oppiaine => this.oppiaine!.tunniste! === oppiaine.tunniste)
        .map('vuosiluokkakokonaisuudet')
        .flatMap()
        .map('vuosiluokat')
        .flatMap()
        .find(vlk => vlk.vuosiluokka === this.vuosiluokka)
        .thru(vuosiluokka => this.oppiaineenVuosiluokkakokonaisuusPerusteDatoilla ? this.oppiaineenVuosiluokkakokonaisuusPerusteDatoilla[vuosiluokka.vuosiluokka] : vuosiluokka)
        .value();
    }
  }

  get oppiaineidenVuosiluokkienTavoitteet() {
    if (this.vuosiluokka) {
      return _.chain(this.oppiaineetJaOppimaarat)
        .map(oppiaine => {
          const perusteOppiaine = this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: oppiaine?.tunniste });
          const oppiaineenVlk = _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }));
          const opsVlk = this.findOpetussuunnitelmanVuosiluokkakokonaisuus(oppiaineenVlk);
          const perusteenVlk = this.findPerusteenVuosiluokkakokonaisuus(this.findPerusteOppiaineenVuosiluokkakokonaisuudet(perusteOppiaine), opsVlk);
          const vlk = _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }));
          const oppiaineenVuosiluokkakokonaisuusDatat = oppiaineenVuosiluokkakokonaisuudenRakennin(
            oppiaine,
            perusteOppiaine,
            this.laajaalaisetOsaamiset,
            vlk,
            opsVlk,
            perusteenVlk,
            null,
          );
          const vuosiluokat = _.keyBy(_.get(oppiaineenVuosiluokkakokonaisuusDatat, 'oppiaineenVuosiluokkakokonaisuus.vuosiluokat'), 'vuosiluokka');
          return {
            oppiaine,
            vuosiluokka: vuosiluokat[this.vuosiluokka!],
          };
        })
        .filter(oppiaineJaTavoitteet => oppiaineJaTavoitteet.vuosiluokka)
        .value();
    }
  }

  get oppiaineenVuosiluokkakokonaisuusPerusteDatoilla() {
    if (this.oppiaine && this.vuosiluokka) {
      const oppiaineenVuosiluokkakokonaisuusPerusteDatoilla = oppiaineenVuosiluokkakokonaisuudenRakennin(
        this.oppiaine,
        this.perusteOppiaine,
        this.laajaalaisetOsaamiset,
        this.oppiaineenVuosiluokkakokonaisuus,
        this.opetussuunnitelmanVuosiluokkakokonaisuus,
        this.perusteenVuosiluokkakokonaisuus,
        this.oppiaineenPohjanVuosiluokkakokonaisuudet,
      );
      return _.keyBy(_.get(oppiaineenVuosiluokkakokonaisuusPerusteDatoilla, 'oppiaineenVuosiluokkakokonaisuus.vuosiluokat'), 'vuosiluokka');
    }

    return {};
  }

  get perusteOppiaine() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: this.oppiaine?.tunniste });
  }

  get laajaalaisetOsaamiset() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset');
  }

  get opetussuunnitelmanVuosiluokkakokonaisuudet() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('vuosiluokkakokonaisuudet');
  }

  get oppiaineenPohjanVuosiluokkakokonaisuudet() {
    return this.oppiaine?.pohjanOppiaine?.vuosiluokkakokonaisuudet;
  }

  get opetussuunnitelmanVuosiluokkakokonaisuus() {
    return this.findOpetussuunnitelmanVuosiluokkakokonaisuus(this.oppiaineenVuosiluokkakokonaisuus);
  }

  findOpetussuunnitelmanVuosiluokkakokonaisuus(oppiaineenVuosiluokkakokonaisuus) {
    return _.get(_.find(this.opetussuunnitelmanVuosiluokkakokonaisuudet, vlk => _.get(vlk.vuosiluokkakokonaisuus, '_tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus')), 'vuosiluokkakokonaisuus');
  }

  get perusteOppiaineVuosiluokkakokonaisuudet() {
    return this.findPerusteOppiaineenVuosiluokkakokonaisuudet(this.perusteOppiaine);
  }

  findPerusteOppiaineenVuosiluokkakokonaisuudet(perusteOppiaine) {
    return _.map(perusteOppiaine?.vuosiluokkakokonaisuudet, ovlk => {
      return {
        ...ovlk,
        tunniste: _.get(_.find(this.perusteenVuosiluokkakokonaisuudet, pvlk => _.toString(pvlk.id) === _.get(ovlk, '_vuosiluokkaKokonaisuus')), 'tunniste'),
      };
    });
  }

  get perusteenVuosiluokkakokonaisuudet() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.vuosiluokkakokonaisuudet');
  }

  get perusteenVuosiluokkakokonaisuus() {
    return this.findPerusteenVuosiluokkakokonaisuus(this.perusteOppiaineVuosiluokkakokonaisuudet, this.opetussuunnitelmanVuosiluokkakokonaisuus);
  }

  findPerusteenVuosiluokkakokonaisuus(perusteOppiaineVuosiluokkakokonaisuudet, vuosiluokkakokonaisuus) {
    return _.find(perusteOppiaineVuosiluokkakokonaisuudet, vlk => vlk?.tunniste === (vuosiluokkakokonaisuus as any)?._tunniste);
  }

  get oppiaineenPohjanVuosiluokkakokonaisuus() {
    return _.find(this.oppiaineenPohjanVuosiluokkakokonaisuudet, ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(this.opetussuunnitelmanVuosiluokkakokonaisuus, '_tunniste'));
  }

  searchIdentity(oppiaine: any) {
    return _.toLower(this.$kaanna(oppiaine.nimi) as any);
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.kaikkiTermit;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content{
  padding: 0 $content-padding;
}

.row {
  margin-left: 0;
}

::v-deep .form-content {
  margin-bottom: 0px;
}

</style>

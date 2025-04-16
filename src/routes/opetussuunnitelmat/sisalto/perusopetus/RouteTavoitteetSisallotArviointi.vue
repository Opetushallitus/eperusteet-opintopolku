<template>
  <div class="content">
    <EpSpinner v-if="!vuosiluokat" />
    <template v-else>
      <h2>{{ $t('tavoitteet-sisallot-ja-arviointi') }}</h2>

      <div
        v-if="vuosiluokat.length > 0"
        v-html="$t('tavoitteet-sisallot-ja-arviointi-ohje')"
      />

      <div
        class="row mt-4"
        :class="{'disabled-events': vuosiluokat.length === 0}"
      >
        <ep-form-content
          name="vuosiluokka"
          class="col-12 col-lg-3 mr-3"
        >
          <EpMultiSelect
            v-model="vuosiluokka"
            :enable-empty-option="true"
            :placeholder="$t('valitse') + '...'"
            :is-editing="true"
            :options="vuosiluokat"
            :searchable="false"
          >
            <template
              #singleLabel="{ option }"
            >
              {{ $t(option + '-luokka') }}
            </template>
            <template
              #option="{ option }"
            >
              {{ $t(option + '-luokka') }}
            </template>
          </EpMultiSelect>
        </ep-form-content>

        <ep-form-content
          name="oppiaine"
          class="col-12 col-lg-6"
        >
          <EpMultiSelect
            v-model="oppiaine"
            :disabled="!vuosiluokka"
            :enable-empty-option="true"
            :placeholder="$t('valitse') + '...'"
            :is-editing="true"
            :options="oppiaineValinnat"
            :search-identity="searchIdentity"
          >
            <template
              #singleLabel="{ option }"
            >
              {{ $kaanna(option.nimi) }}
            </template>
            <template
              #option="{ option }"
            >
              <span :class="{'ml-3': option.isOppimaara}">{{ $kaanna(option.nimi) }}</span>
            </template>
          </EpMultiSelect>
        </ep-form-content>
      </div>

      <div
        v-if="vuosiluokat.length === 0"
        class="mt-4"
      >
        <span class="font-italic">{{ $t('tavoitteet-sisallot-ja-arviointi-ei-vuosiluokkia') }}</span>
      </div>

      <ep-form-content
        v-if="oppiaine"
        name="tavoitteen-osiot"
        class="mt-4"
      >
        <b-form-checkbox-group v-model="osiot">
          <b-form-checkbox
            v-for="osio in osioValinnat"
            :key="'osio-' + osio"
            :value="osio"
          >
            {{ $t(osio) }}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </ep-form-content>

      <hr
        v-if="vuosiluokka"
        class="mt-4"
      >

      <template v-if="!oppiaine && vuosiluokka">
        <h3 class="mt-4 mb-3">
          {{ $t(vuosiluokka + '-luokka') }}
        </h3>

        <OppiaineenVuosiluokkaTiivistetty
          v-for="oppiaineJaTavoitteet in oppiaineidenVuosiluokkienTavoitteet"
          :key="oppiaineJaTavoitteet.oppiaine.id"
          class="mb-4"
          :oppiaine-ja-tavoitteet="oppiaineJaTavoitteet"
          @selectOppiaine="selectOppiaine"
        />
      </template>

      <template v-if="oppiaine && vuosiluokka">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="mb-0">
            <span
              class="link-style clickable"
              @click="oppiaine = null"
            >{{ $t(vuosiluokka + '-luokka') }}</span>
            / {{ $kaanna(oppiaine.nimi) }}
          </h3>

          <portal-target name="sulje-kaikki-tavoitteet-portal" />
        </div>

        <oppiaineen-vuosiluokka
          :oppiaineen-vuosiluokka="oppiaineenVuosiluokka"
          :valinnainen="oppiaine.tyyppi === 'muu_valinnainen'"
          :kuvat="kuvat"
          :termit="termit"
          :nayta-sisaltoalueet="naytaSisaltoalueet"
          :nayta-arviointikriteerit="naytaArviointikriteerit"
          :nayta-laaja-alaiset-osaamiset="naytaLaajaAlaisetOsaamiset"
          avaa-sulje-siirrettavissa
        />
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

  get perusteenOppiaineetByTunniste() {
    return _.chain(this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.oppiaineet'))
      .map(oppiaine => {
        return [
          oppiaine,
          ...(oppiaine.oppimaarat ? oppiaine.oppimaarat : []),
        ];
      })
      .flatten()
      .keyBy('tunniste')
      .value();
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
      .filter(vlk => _.includes(_.map(this.opetussuunnitelmanVuosiluokkakokonaisuudet, 'vuosiluokkakokonaisuus._tunniste'), _.get(vlk, '_vuosiluokkakokonaisuus')))
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
      return _.find(this.oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }));
    }
  }

  get oppiaineenVuosiluokka() {
    if (this.oppiaine && this.vuosiluokka) {
      return _.chain(this.oppiaine.vuosiluokkakokonaisuudet)
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
          const perusteOppiaine = this.perusteenOppiaineetByTunniste[oppiaine.tunniste];
          const oppiaineenVlk = _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }));
          const opsVlk = this.findOpetussuunnitelmanVuosiluokkakokonaisuus(oppiaineenVlk);
          const perusteenOppiaineenVlk = this.findPerusteenOppiaineenVuosiluokkakokonaisuus(perusteOppiaine, opsVlk);
          const vlk = _.find(oppiaine.vuosiluokkakokonaisuudet, vlk => _.find(vlk.vuosiluokat, { vuosiluokka: this.vuosiluokka }));
          const perusteenVuosiluokkakokonaisuus = _.find(this.perusteenVuosiluokkakokonaisuudet, perusteVlk => _.get(perusteVlk, 'tunniste') === _.get(vlk, 'tunniste'));
          const oppiaineenPohjanVuosiluokkakokonaisuus = _.find(oppiaine?.pohjanOppiaine?.vuosiluokkakokonaisuudet, ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(opsVlk, '_tunniste'));
          const oppiaineenVuosiluokkakokonaisuusDatat = oppiaineenVuosiluokkakokonaisuudenRakennin(
            oppiaine,
            perusteOppiaine,
            this.laajaalaisetOsaamiset,
            vlk,
            opsVlk,
            perusteenOppiaineenVlk,
            oppiaineenPohjanVuosiluokkakokonaisuus,
            perusteenVuosiluokkakokonaisuus,
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
        this.perusteenOppiaineenVuosiluokkakokonaisuus,
        this.oppiaineenPohjanVuosiluokkakokonaisuus,
        this.perusteenVuosiluokkakokonaisuus,
      );
      return _.keyBy(_.get(oppiaineenVuosiluokkakokonaisuusPerusteDatoilla, 'oppiaineenVuosiluokkakokonaisuus.vuosiluokat'), 'vuosiluokka');
    }

    return {};
  }

  get perusteOppiaine() {
    if (this.oppiaine) {
      return this.perusteenOppiaineetByTunniste[this.oppiaine.tunniste];
    }
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
    return _.find(this.perusteenVuosiluokkakokonaisuudet, vlk => _.get(vlk, 'tunniste') === _.get(this.oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus'));
  }

  get perusteenOppiaineenVuosiluokkakokonaisuus() {
    return this.findPerusteenOppiaineenVuosiluokkakokonaisuus(this.perusteOppiaine, this.opetussuunnitelmanVuosiluokkakokonaisuus);
  }

  findPerusteenOppiaineenVuosiluokkakokonaisuus(perusteOppiaine, vuosiluokkakokonaisuus) {
    return _.find(this.findPerusteOppiaineenVuosiluokkakokonaisuudet(perusteOppiaine), vlk => vlk?.tunniste === (vuosiluokkakokonaisuus as any)?._tunniste);
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

::v-deep .ep-button .btn{
  padding: 0;
}

</style>

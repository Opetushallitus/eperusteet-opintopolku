<template>
<div>
  <div class="ylaosa">
    <div class="container">
      <b-container fluid>
        <b-row>
          <b-col>
            <div class="laatikko">
              <h3 class="otsikko">{{ $t('eperusteet') }}</h3>
              <p class="kuvaus">{{ $t('eperusteet-kuvaus') }}</p>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-container>
    </div>
  </div>
  <div class="container">
    <b-container fluid>
      <b-row>

        <b-col md="6" class="tile">
          <h2>{{ $t('uutisia') }}</h2>
          <ep-spinner-slot :is-loading="!tiedotteet">
            <div v-for="(tiedote, idx) in tiedotteet" :key="idx">
              <div class="nimi">{{ $kaanna(tiedote.otsikko) }}</div>
              <div class="luotu">{{ $ago(tiedote.luotu) }}</div>
              <pre>{{ tiedote }}</pre>
            </div>
          </ep-spinner-slot>
        </b-col>

        <b-col md="6" class="tile">
          <h2>{{ $t('uusimmat-eperusteet') }}</h2>
          <ep-spinner-slot :is-loading="!uusimmat">
            <pre>{{ uusimmat }}</pre>
            </ep-spinner-slot>
        </b-col>
      </b-row>

      <h2>{{ $t('valtakunnalliset-eperusteet') }}</h2>
      <ep-spinner-slot :is-loading="!perusteet">
        <pre>{{ perusteet }}</pre>
      </ep-spinner-slot>
    </b-container>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Perusteet, Tiedotteet } from '@shared/api/eperusteet';
import { PerusteDto, PerusteHakuDto, TiedoteDto } from '@shared/api/tyypit';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';


@Component({
  components: {
    EpSpinnerSlot,
  },
})
export default class Home extends Vue {
  private perusteet: PerusteHakuDto[] | null = null;
  private uusimmat: PerusteDto[] | null = null;
  private tiedotteet: TiedoteDto[] | null = null;

  async mounted() {
    const [ perusteet, uusimmat, tiedotteet ] = await Promise.all([
      Perusteet.getAllPerusteet(
        0,
        100,
        true,
        true,
        true,
        false,
        undefined,
        undefined,
        [
          'koulutustyyppi_2',
          'koulutustyyppi_5',
          'koulutustyyppi_6',
          'koulutustyyppi_14',
          'koulutustyyppi_15',
          'koulutustyyppi_16',
          'koulutustyyppi_17',
          'koulutustyyppi_18',
          'koulutustyyppi_20',
          'koulutustyyppi_22',
          'koulutustyyppi_23',
          'koulutustyyppi_999907',
        ]),
      Perusteet.getUusimmatPerusteet('fi'),
      Tiedotteet.findTiedotteetBy(0, 10, ['fi'], undefined, undefined, undefined, true, true),
    ]);
    this.perusteet = (perusteet.data as any).data;
    this.uusimmat = uusimmat.data;
    this.tiedotteet = (tiedotteet.data as any).data;
    console.log(tiedotteet);
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.ylaosa {
  background: #fee; /* TODO: Lisää kuva */
  height: 335px;

  .laatikko {
    margin-top: 30px;
    padding: 25px;
    color: #fff;
    background: #1B47AF;

    h3.otsikko {
      margin-bottom: 47px;
    }
  }
}

.container {
  // Todo: käytä muuttujaa
  @media (max-width: 767.98px) {
    max-width: none;
  }

  .tile {
    padding: 25px;
  }
}

</style>

<template>
  <div>
    <ep-form-content
      v-if="tutkinnonosa.koodiArvo"
      class="col-md-12"
      name="koodi"
    >
      <span v-html="tutkinnonosa.koodiArvo" />
    </ep-form-content>

    <ep-form-content
      v-if="tutkinnonosa.tavoitteet"
      class="col-md-12 mb-5"
      name="tavoitteet"
    >
      <span v-html="$kaanna(tutkinnonosa.tavoitteet)" />
    </ep-form-content>

    <ep-form-content
      v-if="!tutkinnonosa.ammattitaitovaatimukset2019 && tutkinnonosa.ammattitaitovaatimukset"
      class="col-md-12 mb-5"
      name="ammattitaitovaatimukset"
    >
      <span v-html="$kaanna(tutkinnonosa.ammattitaitovaatimukset)" />
    </ep-form-content>

    <ep-form-content
      v-if="tutkinnonosa.kuvaus"
      class="col-md-12 mb-5"
      :show-header="false"
    >
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content
      v-if="tutkinnonosa.ammattitaitovaatimukset2019"
      class="col-md-12 mb-5"
      name="ammattitaitovaatimukset"
    >
      <EpAmmattitaitovaatimukset
        v-model="tutkinnonosa.ammattitaitovaatimukset2019"
        :is-editing="false"
      >
        <template #koodi="{koodi}">
          <span>{{ $kaanna(koodi.nimi) }}</span>
        </template>
      </EpAmmattitaitovaatimukset>
    </ep-form-content>

    <template v-if="hasArviointi">
      <template v-if="!tutkinnonosa.geneerinenArviointiasteikko">
        <ep-ammatillinen-arvioinnin-kohdealueet
          v-if="tutkinnonosa.arviointi && tutkinnonosa.arviointi.arvioinninKohdealueet && tutkinnonosa.arviointi.arvioinninKohdealueet.length > 0"
          :arviointiasteikot="arviointiasteikot"
          :arvioinnin-kohdealueet="tutkinnonosa.arviointi.arvioinninKohdealueet"
        />

        <ep-form-content
          v-if="tutkinnonosa.arviointi && tutkinnonosa.arviointi.lisatiedot"
          class="col-md-12"
          name="arviointi"
        >
          <span v-html="$kaanna(tutkinnonosa.arviointi.lisatiedot)" />
        </ep-form-content>
      </template>

      <div v-if="tutkinnonosa.geneerinenArviointiasteikko && tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="tutkinnonosa.geneerinenArviointiasteikko" />
      </div>

      <hr class="mt-5 mb-5">
    </template>

    <ep-form-content
      v-if="tutkinnonosa.ammattitaidonOsoittamistavat"
      class="col-md-12"
      name="ammattitaidon-osoittamistavat"
    >
      <span v-html="$kaanna(tutkinnonosa.ammattitaidonOsoittamistavat)" />

      <hr
        v-if="tutkinnonosa.vapaatTekstit && tutkinnonosa.vapaatTekstit.length > 0"
        class="mt-5 mb-5"
      >
    </ep-form-content>

    <div
      v-for="(vapaaTeksti, index) in tutkinnonosa.vapaatTekstit"
      :key="'vapaateksti'+index"
    >
      <ep-form-content
        class="col-md-12"
        :name="$kaanna(vapaaTeksti.nimi)"
      >
        <span v-html="$kaanna(vapaaTeksti.teksti)" />
      </ep-form-content>

      <hr class="mt-5 mb-5">
    </div>

    <div v-if="tutkinnonosa.valmaTelmaSisalto">
      <template v-if="tutkinnonosa.valmaTelmaSisalto.osaamistavoite && tutkinnonosa.valmaTelmaSisalto.osaamistavoite.length > 0">
        <div
          v-for="(osaamistavoite, index) in tutkinnonosa.valmaTelmaSisalto.osaamistavoite"
          :key="'osaamistavoite'+index"
          class="mb-5"
        >
          <h3>{{ $kaanna(osaamistavoite.nimi) }}</h3>
          <h4 class="mt-3">
            {{ $kaanna(osaamistavoite.kohde) }}
          </h4>
          <ul>
            <li
              v-for="(tavoite, tindex) in osaamistavoite.tavoitteet"
              :key="'osaamistavoitetavoite'+tindex"
            >
              {{ $kaanna(tavoite) }}
            </li>
          </ul>
        </div>
      </template>

      <EpValmaTelmaSisalto :valma-telma-sisalto="tutkinnonosa.valmaTelmaSisalto" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpValmaTelmaSisalto from '@/components/EpAmmatillinen/EpValmaTelmaSisalto.vue';
import _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmattitaitovaatimukset,
    GeneerinenArviointiTaulukko,
    EpValmaTelmaSisalto,
  },
})
export default class EpTutkinnonosaNormaali extends Vue {
  @Prop({ required: true })
  tutkinnonosa: any;

  @Prop({ required: true })
  arviointiasteikot!: any[];

  get hasArviointi() {
    return !_.isNil(this.tutkinnonosa.arviointi?.lisatiedot)
      || !_.isEmpty(this.tutkinnonosa.arviointi?.arvioinninKohdealueet)
      || !_.isNil(this.tutkinnonosa.geneerinenArviointiasteikko);
  }

  get osaamistasonKriteeritFields() {
    return [{
      key: 'osaamistaso',
      label: this.$t('osaamistaso') as string,
      thStyle: { display: 'none' },
    }, {
      key: 'kriteerit',
      label: this.$t('kriteerit') as string,
      thStyle: { display: 'none' },
    }] as any[];
  }
}
</script>

<style scoped lang="scss">

</style>

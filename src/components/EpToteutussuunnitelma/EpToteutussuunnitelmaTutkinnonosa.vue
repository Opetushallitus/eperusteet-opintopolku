<template>
  <div v-if="sisaltoviite">
    <h2
      class="otsikko mb-4"
    >
      {{ $kaanna(sisaltoviite.tekstiKappale.nimi) }}, {{ laajuus }} {{ $t('osaamispiste') }}
    </h2>

    <ep-form-content
      v-if="perusteenTutkinnonosa && perusteenTutkinnonosa.kuvaus"
      class="col-md-12 mt-4"
      name="tutkinnon-osan-kuvaus"
    >
      <ep-content-viewer
        :value="$kaanna(perusteenTutkinnonosa.kuvaus)"
        :kuvat="kuvat"
      />
    </ep-form-content>

    <ep-form-content
      v-if="sisaltoviite.tekstiKappale.teksti"
      class="col-md-12 mt-4"
      name="koulutuksen-jarjestajan-tarkennus"
    >
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.tekstiKappale.teksti)"
        :kuvat="kuvat"
      />
    </ep-form-content>

    <ep-form-content
      v-for="(vapaa, index) in sisaltoviite.tosa.vapaat"
      :key="'tosavapaateksti'+index"
      class="col-md-12 mt-4"
    >
      <template #header>
        <label>{{ $kaanna(vapaa.nimi) }}</label>
      </template>
      <ep-content-viewer
        :value="$kaanna(vapaa.teksti)"
        :kuvat="kuvat"
      />
    </ep-form-content>

    <ep-form-content
      v-if="sisaltoviite.tosa.toteutukset && sisaltoviite.tosa.toteutukset.length > 0 && (!osaAlueet || osaAlueet.length === 0)"
      class="col-md-12 mt-4 mb-4"
      name="koulutuksen-jarjestajan-toteutus"
      header-type="h3"
    >
      <EpToteutukset
        :toteutukset="toteutukset"
        :kuvat="kuvat"
      />
    </ep-form-content>

    <div v-if="sisaltoviite.tosa.omatutkinnonosa">
      <ep-form-content
        v-if="sisaltoviite.tosa.omatutkinnonosa.koodi"
        class="col-md-12"
        name="koodi"
      >
        <span v-html="sisaltoviite.tosa.omatutkinnonosa.koodi" />
      </ep-form-content>

      <div
        v-if="sisaltoviite.tosa.omatutkinnonosa.tavoitteet"
        class="mb-4"
      >
        <ep-form-content
          class="col-md-12"
          name="tavoitteet"
        >
          <ep-content-viewer
            :value="$kaanna(sisaltoviite.tosa.omatutkinnonosa.tavoitteet)"
            :kuvat="kuvat"
          />
        </ep-form-content>
        <hr>
      </div>

      <div
        v-if="hasAmmattitaitovaatimuksetLista"
        class="mb-4"
      >
        <ep-form-content
          class="col-md-12"
          name="ammattitaitovaatimukset"
        >
          <div
            v-for="(ammattitaitovaatimus, index) in sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimuksetLista"
            :key="'atv'+index"
          >
            <div
              v-for="(vaatimuskohde, index) in ammattitaitovaatimus.vaatimuksenKohteet"
              :key="'vkohde'+index"
            >
              <div class="font-600">
                {{ $kaanna(vaatimuskohde.otsikko) }}
              </div>
              <ul>
                <li
                  v-for="(vaatimus, index) in vaatimuskohde.vaatimukset"
                  :key="'vaatimus'+index"
                >
                  {{ $kaanna(vaatimus.selite) }}
                </li>
              </ul>
            </div>
          </div>
        </ep-form-content>
        <hr>
      </div>


      <ep-form-content
        v-if="hasAmmattitaitovaatimukset"
        class="col-md-12 mb-5"
        name="ammattitaitovaatimukset"
      >
        <EpAmmattitaitovaatimukset
          :model-value="sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimukset"
          :is-editing="false"
        >
          <template #koodi="{koodi}">
            <span>{{ $kaanna(koodi.nimi) }}</span>
          </template>
        </EpAmmattitaitovaatimukset>
        <hr/>
      </ep-form-content>

      <div
        v-if="arvoinninTyyppi === 'tutkinnonosakohtainen'"
        class="mb-5"
      >
        <ep-ammatillinen-arvioinnin-kohdealueet
          :arviointiasteikot="arviointiasteikot"
          :arvioinnin-kohdealueet="sisaltoviite.tosa.omatutkinnonosa.arviointi.arvioinninKohdealueet"
        />
        <hr>
      </div>

      <GeneerinenArviointiTaulukko
        v-if="arvoinninTyyppi === 'geneerinen'"
        :arviointi="sisaltoviite.tosa.omatutkinnonosa.geneerinenArviointiasteikko"
      />

      <ep-form-content
        v-if="sisaltoviite.tosa.omatutkinnonosa.ammattitaidonOsoittamistavat"
        class="col-md-12"
        name="ammattitaidon-osoittamistavat"
      >
        <ep-content-viewer
          :value="$kaanna(sisaltoviite.tosa.omatutkinnonosa.ammattitaidonOsoittamistavat)"
          :kuvat="kuvat"
        />
      </ep-form-content>
    </div>

    <div v-if="perusteenTutkinnonosa">
      <h3>{{ $t('perusteen-sisalto') }}</h3>

      <ep-form-content
        v-if="perusteenTutkinnonosa.koodiArvo"
        class="col-md-12"
        name="koodi"
      >
        <span v-html="perusteenTutkinnonosa.koodiArvo" />
      </ep-form-content>

      <ep-form-content
        v-if="perusteenTutkinnonosa.ammattitaitovaatimukset && perusteenTutkinnonosa.tyyppi === 'normaali'"
        class="col-md-12 mb-5"
        name="ammattitaitovaatimukset"
      >
        <ep-content-viewer
          class="ammattitaitovaatimukset"
          :value="$kaanna(perusteenTutkinnonosa.ammattitaitovaatimukset)"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <ep-ammatillinen-arvioinnin-kohdealueet
        v-if="hasTutkinnonosakohtainenArviointi"
        :arviointiasteikot="arviointiasteikot"
        :arvioinnin-kohdealueet="perusteenTutkinnonosa.arviointi.arvioinninKohdealueet"
      />

      <div v-if="perusteenTutkinnonosa.geneerinenArviointiasteikko && perusteenTutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="perusteenTutkinnonosa.geneerinenArviointiasteikko" />
      </div>

      <ep-form-content
        v-if="perusteenTutkinnonosa.ammattitaidonOsoittamistavat"
        class="col-md-12 mb-5"
        name="ammattitaidon-osoittamistavat"
      >
        <ep-content-viewer
          :value="$kaanna(perusteenTutkinnonosa.ammattitaidonOsoittamistavat)"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <template v-if="!osaAlueet || osaAlueet.length ===0">
        <ep-form-content
          v-if="perusteenOsaAlueet.length > 0"
          class="col-md-12 mb-5"
          name="osa-alueet"
        >
          <ep-ammatillinen-osaalueet
            :arviointiasteikot="arviointiasteikot"
            :osaalueet="perusteenOsaAlueet"
          />
        </ep-form-content>

        <ep-form-content
          v-if="perusteenPakollisetOsaAlueet && perusteenPakollisetOsaAlueet.length > 0"
          class="col-md-12 mb-5"
          name="pakolliset-osa-alueet"
        >
          <ep-ammatillinen-osaalueet
            :arviointiasteikot="arviointiasteikot"
            :osaalueet="perusteenPakollisetOsaAlueet"
          />
        </ep-form-content>

        <ep-form-content
          v-if="perusteenValinnaisetOsaAlueet && perusteenValinnaisetOsaAlueet.length > 0"
          class="col-md-12 mb-5"
          name="valinnaiset-osa-alueet"
        >
          <ep-ammatillinen-osaalueet
            :arviointiasteikot="arviointiasteikot"
            :osaalueet="perusteenValinnaisetOsaAlueet"
          />
        </ep-form-content>
      </template>
    </div>

    <ep-form-content
      v-if="pakollisetOsaAlueet.length > 0"
      class="col-md-12 mt-4"
      name="pakolliset-osa-alueet"
    >
      <EpOsaAlueListaus
        :osa-alueet="pakollisetOsaAlueet"
        :sisaltoviite-id="sisaltoviite.id"
      />
    </ep-form-content>

    <ep-form-content
      v-if="valinnaisetOsaAlueet.length > 0"
      class="col-md-12 mt-4"
      name="valinnaiset-osa-alueet"
    >
      <EpOsaAlueListaus
        :osa-alueet="valinnaisetOsaAlueet"
        :sisaltoviite-id="sisaltoviite.id"
      />
    </ep-form-content>

    <ep-form-content
      v-if="paikallisetOsaAlueet.length > 0"
      class="col-md-12 mt-4"
      name="paikalliset-osa-alueet"
    >
      <EpOsaAlueListaus
        :osa-alueet="paikallisetOsaAlueet"
        :sisaltoviite-id="sisaltoviite.id"
      />
    </ep-form-content>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmatillinenOsaalueet from '@/components/EpAmmatillinen/EpAmmatillinenOsaalueet.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpOsaAlueListaus from '@/components/EpToteutussuunnitelma/EpOsaAlueListaus.vue';
import { OmaOsaAlueDtoTyyppiEnum, OpetussuunnitelmaKaikkiDtoJulkaisukieletEnum, Koodistot } from '@shared/api/amosaa';
import EpToteutukset from '@/components/EpToteutussuunnitelma/EpToteutukset.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import { $kaanna, $t } from '@shared/utils/globals';

const props = defineProps({
  sisaltoviite: {
    type: Object,
    required: true,
  },
  perusteenTutkinnonosaViite: {
    type: Object,
    required: true,
  },
  perusteenTutkinnonosa: {
    type: Object,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
  arviointiasteikot: {
    type: Array,
    required: true,
  },
  julkaisukielet: {
    type: Array as () => OpetussuunnitelmaKaikkiDtoJulkaisukieletEnum[],
    required: false,
    default: () => [],
  },
});

const tutkintonimikkeetJaOsaamisalatKoodit = ref<any | null>(null);
const toteutukset = ref<any | null>(null);

onMounted(async () => {
  tutkintonimikkeetJaOsaamisalatKoodit.value = _.chain(await Promise.all(
    _.chain(props.sisaltoviite.tosa?.toteutukset)
      .map(toteutus => toteutus.koodit)
      .flatten()
      .uniq()
      .map(koodi => Koodistot.getKoodistoKoodiByUri(koodi))
      .value()),
  ).map('data')
    .map(koodi => {
      return {
        ...koodi,
        nimi: _.mapValues(_.keyBy(koodi.metadata, v => _.toLower(v.kieli)), v => v.nimi),
      };
    })
    .keyBy('koodiUri')
    .value();

  toteutukset.value = _.map(props.sisaltoviite.tosa?.toteutukset, toteutus => {
    return {
      ...toteutus,
      tutkintonimikkeetJaOsaamisalat: _.map(toteutus.koodit, koodi => tutkintonimikkeetJaOsaamisalatKoodit.value[koodi]),
    };
  });
});

const hasKuvaus = computed(() => {
  return props.sisaltoviite.tekstiKappale.teksti || (props.perusteenTutkinnonosa && props.perusteenTutkinnonosa.kuvaus);
});

const luotu = computed(() => {
  if (props.perusteenTutkinnonosa) {
    return props.perusteenTutkinnonosa.luotu;
  }
  return undefined;
});

const muokattu = computed(() => {
  if (props.perusteenTutkinnonosa) {
    return props.perusteenTutkinnonosa.muokattu;
  }
  else if (props.sisaltoviite.tosa) {
    return props.sisaltoviite.tosa.muokattu;
  }
  return undefined;
});

const laajuus = computed(() => {
  if (props.perusteenTutkinnonosaViite) {
    return props.perusteenTutkinnonosaViite.laajuus;
  }
  else if (props.sisaltoviite.tosa.omatutkinnonosa) {
    return props.sisaltoviite.tosa.omatutkinnonosa.laajuus;
  }
  return undefined;
});

const koodiFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi'),
    thStyle: { width: '40%' },
    formatter: (value: any) => {
      return $kaanna(value);
    },
  }, {
    key: 'koodiArvo',
    label: $t('koodi'),
  }] as any[];
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const osaAlueet = computed(() => {
  return _.chain(props.sisaltoviite.osaAlueet)
    .map(osaAlue => {
      return {
        ...osaAlue,
        perusteenOsaAlue: _.find(perusteenOsaAlueet.value, pOsaAlue => pOsaAlue.id === osaAlue.perusteenOsaAlueId),
      };
    })
    .filter(osaAlue => !!osaAlue.nimi[kieli.value])
    .value();
});

const pakollisetOsaAlueet = computed(() => {
  return _.filter(osaAlueet.value, oa => oa.tyyppi === _.toLower(OmaOsaAlueDtoTyyppiEnum.PAKOLLINEN));
});

const valinnaisetOsaAlueet = computed(() => {
  return _.filter(osaAlueet.value, oa => oa.tyyppi === _.toLower(OmaOsaAlueDtoTyyppiEnum.VALINNAINEN));
});

const paikallisetOsaAlueet = computed(() => {
  return _.filter(osaAlueet.value, oa => oa.tyyppi === _.toLower(OmaOsaAlueDtoTyyppiEnum.PAIKALLINEN));
});

const perusteenOsaAlueet = computed(() => {
  return props.perusteenTutkinnonosa?.osaAlueet;
});

const perusteenOsaAlueetFiltered = (osaamistavoiteFilter) => {
  return _.chain(perusteenOsaAlueet.value)
    .map(osaAlue => {
      return {
        ...osaAlue,
        osaamistavoitteet: _.filter(osaAlue.osaamistavoitteet, osaamistavoiteFilter),
      };
    })
    .filter(osaAlue => _.size(osaAlue.osaamistavoitteet) > 0)
    .filter(osaAlue => !!osaAlue.nimi[kieli.value])
    .value();
};

const perusteenPakollisetOsaAlueet = computed(() => {
  if (props.perusteenTutkinnonosa) {
    return perusteenOsaAlueetFiltered(['pakollinen', true]);
  }
  return undefined;
});

const perusteenValinnaisetOsaAlueet = computed(() => {
  if (props.perusteenTutkinnonosa) {
    return perusteenOsaAlueetFiltered(['pakollinen', false]);
  }
  return undefined;
});

const hasAmmattitaitovaatimukset = computed(() => {
  return !_.isEmpty(props.sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimukset?.kohdealueet)
    || !_.isEmpty(props.sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimukset?.vaatimukset);
});

const hasAmmattitaitovaatimuksetLista = computed(() => {
  return !_.chain(props.sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimuksetLista)
    .map('vaatimuksenKohteet')
    .flatMap()
    .isEmpty()
    .value();
});

const hasTutkinnonosakohtainenArviointi = computed(() => {
  return !_.isEmpty(props.perusteenTutkinnonosa?.arviointi?.arvioinninKohdealueet);
});

const arvoinninTyyppi = computed(() => {
  if (props.sisaltoviite.tosa.omatutkinnonosa.geneerinenarviointi) {
    return 'geneerinen';
  }

  if (_.size(_.get(props.sisaltoviite.tosa, 'omatutkinnonosa.arviointi.arvioinninKohdealueet')) > 0) {
    return 'tutkinnonosakohtainen';
  }

  return undefined;
});
</script>

<style scoped lang="scss">
  .font-600 {
    font-weight: 600;
  }

  .ammattitaitovaatimukset {
    :deep(dd) {
      margin-left: 2.5rem;
      margin-bottom: 0;
    }
  }
</style>

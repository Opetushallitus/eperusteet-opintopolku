<template>
  <div>
    <EpHeader
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template #header>
        <span v-if="tutkinnonosa">{{ $kaanna(tutkinnonosa.nimi) }}</span>
        <span v-if="laajuus">{{ laajuus }} {{ $t('osaamispiste') }}</span>
      </template>
    </EpHeader>
    <div class="container mt-4">
      <div class="content">
        <EpSpinner v-if="!tutkinnonosa" />
        <div v-else>
          <EpFormContent
            v-if="perusteet"
            class="col-md-12 mb-5"
          >
            <EpCollapse
              class="mb-3"
              :shadow="true"
              :border-bottom="false"
              :expanded-by-default="perusteet.length === 1"
            >
              <template #header>
                <h2
                  class="header"
                >
                  {{ $t('tutkinnot-joilla-tutkinnon-osa-on') }}
                </h2>
              </template>
              <hr>
              <div
                v-for="(peruste, oidx) in perusteet"
                :key="oidx"
                class="nimikkeet"
              >
                <div class="d-flex">
                  <router-link :to="{ name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: peruste.id }}">
                    {{ $kaanna(peruste.nimi) }}
                  </router-link>
                  <EpVoimassaolo :voimassaolo="peruste" />
                  <span
                    v-if="peruste.diaarinumero"
                    class="ml-1"
                  >| {{ $t('diaarinumero') + ': ' + peruste.diaarinumero }}</span>
                </div>
              </div>
            </EpCollapse>
          </EpFormContent>

          <EpTutkinnonosaTutke
            :tutkinnonosa="tutkinnonosa.tutkinnonosa"
            :arviointiasteikot="arviointiasteikot"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { RawLocation } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { AmmatillinenPerusteHakuStore } from '@/stores/AmmatillinenPerusteHakuStore';
import { murupolkuAmmatillinenRoot } from '@/utils/murupolku';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import _ from 'lodash';

@Component({
  components: {
    EpVoimassaolo,
    EpFormContent,
    EpCollapse,
    EpHeader,
    EpSpinner,
    EpTutkinnonosaNormaali,
    EpTutkinnonosaTutke,
    EpOpasKiinnitysLinkki,
  },
})
export default class RouteTutkinnonosaTutke extends Vue {
  @Prop({ required: true })
  private ammatillinenPerusteHakuStore!: AmmatillinenPerusteHakuStore;

  async mounted() {
    await this.ammatillinenPerusteHakuStore.updateFilters({ perusteet: false, tutkinnonosat: true, koodi: this.koodi });
    await this.ammatillinenPerusteHakuStore.fetchArviointiasteikot();
  }

  get arviointiasteikot() {
    return this.ammatillinenPerusteHakuStore.arviointiasteikot;
  }

  get tutkinnonosa() {
    if (this.ammatillinenPerusteHakuStore.perusteet) {
      return this.ammatillinenPerusteHakuStore.perusteet[0];
    }
  }

  get perusteet() {
    if (this.tutkinnonosa?.perusteet) {
      return _.chain(this.tutkinnonosa.perusteet)
        .map(peruste => ({
          ...peruste,
          route: this.perusteRoute(peruste),
        }))
        .value();
    }
  }

  get laajuus() {
    return this.tutkinnonosa?.laajuus;
  }

  perusteRoute(peruste) {
    return {
      name: 'ammatillinenkooste',
      params: {
        perusteId: _.toString(peruste.id),
      },
    };
  }

  get koodi() {
    return this.$route.params.koodi;
  }

  get koulutustyyppi() {
    return 'ammatillinen';
  }

  get murupolku() {
    return [
      murupolkuAmmatillinenRoot(this.koulutustyyppi),
      {
        label: this.tutkinnonosa?.nimi,
        location: {
          ...this.$route,
        } as RawLocation,
      },
    ];
  }

  @Meta
  getMetaInfo() {
    return {
      title: (this as any).$t('yhteinen-tutkinnon-osa'),
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.header {
  font-size: large;
  font-weight: 400;
}

.content {
  padding: 0 $content-padding;
}

</style>

<template>
  <router-view v-if="tekstikappaleenOsa">
    <template slot="previous-next-navigation">
      <slot name="previous-next-navigation" />
    </template>
  </router-view>

  <div
    v-else
    class="content"
  >
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <ep-content-viewer
        :value="$kaanna(perusteenOsa.teksti)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <!-- Alikappaleet -->
      <div
        v-for="(alikappaleViite, idx) in alikappaleet"
        :key="idx"
      >
        <ep-heading
          class="otsikko"
          :level="alikappaleViite.level + 2"
        >
          <span v-if="alikappaleNumeroinnitById[alikappaleViite.id]">{{ alikappaleNumeroinnitById[alikappaleViite.id] }}</span>
          {{ $kaanna(alikappaleViite.perusteenOsa.nimi) }}
        </ep-heading>
        <ep-content-viewer
          :value="$kaanna(alikappaleViite.perusteenOsa.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <EpOpasKiinnitysLinkki
        v-if="osaamisalaKoodiUri"
        :koodi-uri="osaamisalaKoodiUri"
      />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { ViiteLaaja } from '@shared/api/eperusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpOpasKiinnitysLinkki,
  },
})
export default class RouteTekstikappale extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  mounted() {
    if (_.some(_.map(this.perusteenOsaViite?.lapset, 'perusteenOsa.osanTyyppi'), osanTyyppi => _.includes(this.redirectToLinkkiSivuLapsiTyypit, osanTyyppi))) {
      this.$router.push({
        name: 'linkkisivu',
        params: {
          linkkisivuId: this.$route.params.viiteId,
        },
      });
    }
  }

  get redirectToLinkkiSivuLapsiTyypit() {
    return ['koulutuksenosa', 'koto_opinto', 'koto_kielitaitotaso', 'koto_laajaalainenosaaminen', 'opintokokonaisuus'];
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get perusteenOsaViite() {
    return this.perusteenOsaStore.perusteenOsaViite;
  }

  get alikappaleet() {
    if (!_.isEmpty(this.perusteenOsaViite)) {
      const viitteet: ViiteLaaja[] = [];

      const stack: ViiteLaaja[] = [this.perusteenOsaViite!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        if (head.perusteenOsa) {
          viitteet.push(head);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite,
          level: (head.level || 0) + 1,
        })));
      }

      // Poistetaan nykyinen viite alikappaleista
      return _.slice(viitteet, 1);
    }
    else {
      return [];
    }
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get tekstikappaleenOsa() {
    return this.$route.params.osa || this.$route.params.vapaatekstiId;
  }

  get osaamisalaKoodiUri() {
    return (this.perusteenOsa as any)?.osaamisala?.uri;
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
@import '@shared/styles/_mixins.scss';

.content {
  padding: $content-padding;
}
</style>

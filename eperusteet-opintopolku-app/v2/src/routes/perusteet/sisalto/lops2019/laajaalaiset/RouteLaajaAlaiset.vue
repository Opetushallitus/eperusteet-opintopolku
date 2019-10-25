<template>
<div class="content">
    <div v-if="laajaAlaisetKokonaisuus">
        <h2 class="otsikko" slot="header">{{ $t('laaja-alaiset-osaamiset') }}</h2>
        <div class="teksti">
            <div v-if="hasLaajaAlaiset" class="laaja-alaiset" id="laaja-alaiset-lista">
                <div v-for="(laajaAlainen, idx) in laajaAlaiset" :key="idx">
                    <h3>{{ $kaanna(laajaAlainen.nimi) }}</h3>
                    <div v-if="laajaAlainen.koodi">
                        <strong>{{ $t('koodi') }}</strong>
                        <p>{{ laajaAlainen.koodi.arvo }}</p>
                    </div>
                    <div v-html="$kaanna(laajaAlainen.kuvaus)"></div>
                </div>
            </div>
        </div>
    </div>
    <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019LaajaAlaisetStore } from '@/stores/Lops2019LaajaAlaisetStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  }
})
export default class RouteLaajaAlaiset extends Vue {
  @Prop({ required: true })
  private lops2019LaajaAlaisetStore!: Lops2019LaajaAlaisetStore;

  created() {
    this.lops2019LaajaAlaisetStore.getLaajaAlaisetKokonaisuus(
      _.parseInt(this.$route.params.perusteId),
    );
  }

  get laajaAlaisetKokonaisuus() {
    return this.lops2019LaajaAlaisetStore.laajaAlaisetKokonaisuus;
  }

  get laajaAlaiset() {
    if (this.laajaAlaisetKokonaisuus && this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset) {
      return this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset;
    }
  }

  get hasLaajaAlaiset() {
    return !_.isEmpty(this.laajaAlaiset);
  }
}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';
@import '../../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>

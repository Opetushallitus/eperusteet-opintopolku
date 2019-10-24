<template>
<div class="content">
    <div v-if="oppiaineet">
        <h2 class="otsikko" slot="header">{{ $t('oppiaineet') }}</h2>
        <div class="teksti">
            <div class="oppiaineet" id="oppiaineet-lista">
                <div class="oppiaine" v-for="(oppiaine, idx) in oppiaineet" :key="idx">
                    <router-link :to="{ name: 'lops2019oppiaine', params: { oppiaineId: oppiaine.id } }">
                        {{ $kaanna(oppiaine.nimi) }}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  }
})
export default class RouteOppiaineet extends Vue {
  @Prop({ required: true })
  private lops2019oppiaineetStore!: Lops2019OppiaineetStore;

  get oppiaineet() {
    return this.lops2019oppiaineetStore.oppiaineet;
  }
}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';

.content {
    padding: 0 $content-padding;
    overflow-x: auto;

    .otsikko, .teksti {
        hyphens: auto;

        & /deep/ p {
            text-align: justify;
        }

        & /deep/ img {
            max-width: 100%;
            margin: 0 auto;
        }

        & /deep/ table {
            max-width: 100%;
            margin: 0 auto;
        }
    }
}
</style>

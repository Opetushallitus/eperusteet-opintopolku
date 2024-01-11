<template>
  <div class="content">
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { NavigationNodeDtoTypeEnum } from '@shared/api/eperusteet';

@Component
export default class RotuePerusopetusOppiaineet extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  mounted() {
    if (this.perusteDataStore.navigation) {
      const oppiaineetNavi = _.head(_.filter(this.perusteDataStore.navigation.children, { type: NavigationNodeDtoTypeEnum.Perusopetusoppiaineet }));
      if (oppiaineetNavi) {
        const oppiaineId = _.get(_.head(oppiaineetNavi.children), 'id');

        this.$router.push({
          name: 'perusopetusoppiaine',
          params: {
            oppiaineId: _.toString(oppiaineId),
          },
        });
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }
</style>

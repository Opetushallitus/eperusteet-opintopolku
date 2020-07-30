<template>
  <div >
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { NavigationNodeDtoTypeEnum } from '@shared/api/ylops';

@Component
export default class RouteOpetussuunnitelmaPerusopetusOppiaineet extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  mounted() {
    if (this.opetussuunnitelmaDataStore.navigation) {
      const oppiaineetNavi = _.head(_.filter(this.opetussuunnitelmaDataStore.navigation.children, { type: NavigationNodeDtoTypeEnum.Perusopetusoppiaineet }));
      if (oppiaineetNavi) {
        const oppiaineId = _.get(_.head(oppiaineetNavi.children), 'id');

        this.$router.push({
          name: 'opetussuunnitelmaperusopetusoppiaine',
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

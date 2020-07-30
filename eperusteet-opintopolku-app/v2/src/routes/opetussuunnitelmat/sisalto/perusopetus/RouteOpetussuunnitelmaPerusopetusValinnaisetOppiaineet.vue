<template>
  <div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { NavigationNodeDtoTypeEnum } from '@shared/api/ylops';

@Component
export default class RouteOpetussuunnitelmaPerusopetusValinnaisetOppiaineet extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  mounted() {
    if (this.opetussuunnitelmaDataStore.navigation) {
      if (this.vlkId) {
        const oppiaineetNavi = _.head(_.filter(this.opetussuunnitelmaDataStore.flattenedSidenav, navi => {
          return _.get(navi.meta as any, 'vlkId') === this.vlkId && navi.type === NavigationNodeDtoTypeEnum.Valinnaisetoppiaineet;
        }));

        if (oppiaineetNavi) {
          const oppiaineId = _.get(_.head(oppiaineetNavi.children), 'id');

          this.$router.push({
            name: 'opetussuunnitelmaperusopetusvuosiluokanoppiaine',
            params: {
              oppiaineId: _.toString(oppiaineId),
              vlkId: this.vlkId,
            },
          });
        }
      }
      else {
        const oppiaineetNavi = _.head(_.filter(this.opetussuunnitelmaDataStore.flattenedSidenav, navi => {
          return _.get(navi.meta as any, 'vlkId') == null && navi.type === NavigationNodeDtoTypeEnum.Valinnaisetoppiaineet;
        }));
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

  get vlkId() {
    return this.$route.params.vlkId;
  }
}

</script>

<style scoped lang="scss">
</style>

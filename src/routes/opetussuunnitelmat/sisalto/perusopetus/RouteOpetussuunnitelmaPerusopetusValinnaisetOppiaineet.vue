<template>
  <div />
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { NavigationNodeDtoTypeEnum } from '@shared/api/ylops';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const route = useRoute();
const router = useRouter();

const vlkId = computed(() => {
  return route.params.vlkId;
});

onMounted(() => {
  if (opetussuunnitelmaDataStore.navigation) {
    if (vlkId.value) {
      const oppiaineetNavi = _.head(_.filter(opetussuunnitelmaDataStore.flattenedSidenav, navi => {
        return _.get(navi.meta as any, 'vlkId') === vlkId.value && navi.type === NavigationNodeDtoTypeEnum.Valinnaisetoppiaineet;
      }));

      if (oppiaineetNavi) {
        const oppiaineId = _.get(_.head(oppiaineetNavi.children), 'id');

        router.push({
          name: 'opetussuunnitelmaperusopetusvuosiluokanoppiaine',
          params: {
            oppiaineId: _.toString(oppiaineId),
            vlkId: vlkId.value,
          },
        });
      }
    }
    else {
      const oppiaineetNavi = _.head(_.filter(opetussuunnitelmaDataStore.flattenedSidenav, navi => {
        return _.get(navi.meta as any, 'vlkId') == null && navi.type === NavigationNodeDtoTypeEnum.Valinnaisetoppiaineet;
      }));
      if (oppiaineetNavi) {
        const oppiaineId = _.get(_.head(oppiaineetNavi.children), 'id');

        router.push({
          name: 'opetussuunnitelmaperusopetusoppiaine',
          params: {
            oppiaineId: _.toString(oppiaineId),
          },
        });
      }
    }
  }
});
</script>

<style scoped lang="scss">
</style>

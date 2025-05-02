<template>
  <div class="content" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { NavigationNodeDtoTypeEnum } from '@shared/api/eperusteet';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const perusteDataStore = getCachedPerusteStore();

const router = useRouter();

onMounted(() => {
  if (perusteDataStore.navigation) {
    const oppiaineetNavi = _.head(_.filter(perusteDataStore.navigation.children, { type: NavigationNodeDtoTypeEnum.Perusopetusoppiaineet }));
    if (oppiaineetNavi) {
      const oppiaineId = _.get(_.head(oppiaineetNavi.children), 'id');

      router.push({
        name: 'perusopetusoppiaine',
        params: {
          oppiaineId: _.toString(oppiaineId),
        },
      });
    }
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }
</style>

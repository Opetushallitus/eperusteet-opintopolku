<template>
  <div />
</template>

<script setup lang="ts">
import _ from 'lodash';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { NavigationNodeDtoTypeEnum } from '@shared/api/ylops';

const props = defineProps({
  opetussuunnitelmaDataStore: {
    type: Object as () => OpetussuunnitelmaDataStore,
    required: true,
  },
});

const router = useRouter();

onMounted(() => {
  if (props.opetussuunnitelmaDataStore.navigation) {
    const oppiaineetNavi = _.head(_.filter(props.opetussuunnitelmaDataStore.navigation.children, { type: NavigationNodeDtoTypeEnum.Perusopetusoppiaineet }));
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
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>

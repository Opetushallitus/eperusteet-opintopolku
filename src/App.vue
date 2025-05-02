<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { onMounted, getCurrentInstance, computed } from 'vue';
import { getKaannokset } from '@shared/api/eperusteet';
import { i18n } from './main';
import { Kielet } from '@shared/stores/kieli';
import { ref } from 'vue';
import { useLoading } from 'vue-loading-overlay';
import { loadingOptions } from './utils/loading';

const $loading = useLoading({
  ...loadingOptions,
  opacity: 1,
});

onMounted(async () => {
  const loading = $loading.show();
  Kielet.load(await getKaannokset());
  loading.hide();
});
</script>

<style lang="scss" src="@shared/styles/app.scss"></style>

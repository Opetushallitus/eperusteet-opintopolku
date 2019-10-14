<template>
<div class="content">
    <pre>tekstikappale</pre>
</div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';


@Component
export default class RouteTekstikappale extends Mixins(EpPerusteRoute) {
}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
    padding: $content-padding;
}
</style>

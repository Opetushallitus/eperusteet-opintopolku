<template>
<div class="content">
    <h2 class="otsikko" slot="header">{{ $t('oppiaineet') }}</h2>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RouteOppiaineet extends Vue {

}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';

.content {
    padding: $content-padding;
}
</style>

<template>
  <span ref="ball"
        class="material-icons"
        :style="dynstyle"
        :title="$t(kind)"
        :class="spanClass"
        aria-hidden="true">
        circle
    <b-popover v-if="tooltip"
               :target="() => $refs['ball']"
               :placement="'top'"
               triggers="hover"
               variant="primary">
      <span>{{$t(kind)}}</span>
    </b-popover>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { themeColors, themes, rgb2string } from '../../utils/perusteet';

const moduuliColors = {
  'normaali': [0, 0, 0],
  'pakollinen': [189, 219, 138],
  'valinnainen': [241, 102, 192],
  'paikallinen': [255, 165, 0],
  'valittu': [128, 255, 192],
};

export type IndicatorKind = 'normaali'
  | 'pakollinen'
  | 'valinnainen'
  | 'laadinta'
  | 'julkaistu'
  | 'valmis'
  | 'poistettu'
  | 'paikallinen'
  | 'offline'
  | 'online'
  | 'ammatillinen'
  | 'esiopetus'
  | 'lukiokoulutus'
  | 'perusopetus'
  | 'varhaiskasvatus'
  | 'taiteenperusopetus'
  | 'vapaasivistystyo'
  | 'tutkintoonvalmentava'
  | 'kotoutumiskoulutus';

@Component
export default class EpColorIndicator extends Vue {
  @Prop({ default: 'normaali' })
  kind!: IndicatorKind;

  @Prop({ default: true })
  tooltip!: boolean;

  @Prop({ default: 10 })
  size!: number;

  @Prop({ required: false })
  backgroundColor!: string;

  get spanClass() {
    return `ball ball-${this.kind}${this.tooltip ? ' ball-tooltip' : ''}`;
  }

  get background() {
    return themeColors[themes[this.kind]] || themeColors[this.kind] || moduuliColors[this.kind] || [0, 0, 0];
  }

  get dynstyle() {
    const result = {
      'color': this.backgroundColor ? this.backgroundColor : rgb2string(this.background),
    };

    return result;
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.ball {
  font-size: 0.7rem;
  color: black;
}

.ball-normaali {
  color: #000000;
}

.ball-pakollinen {
  color: #bddb8a;
}

.ball-valinnainen {
  color: #f166c0;
}

.ball-paikallinen {
  color: #ffa500;
}

.ball-offline {
  color: #DADADA;
}

.ball-online {
  color: #7CD443;
}

.ball-tooltip {
  cursor: help;
}

</style>

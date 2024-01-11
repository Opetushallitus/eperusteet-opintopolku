<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'EpHeading',
})
export default class EpHeading extends Vue {
  @Prop({ required: true, type: Number })
  private level!: number;

  render(createElement) {
    let level = this.level;
    if (this.level < 1) {
      level = 1;
    }
    else if (this.level > 6) {
      level = 6;
    }
    return createElement('h' + level, this.$slots.default);
  }
}
</script>

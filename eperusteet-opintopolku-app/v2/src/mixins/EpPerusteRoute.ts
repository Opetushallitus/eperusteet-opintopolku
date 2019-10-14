import { Prop, Component } from 'vue-property-decorator';
import EpRoute from '@shared/mixins/EpRoute';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component
export default class EpPerusteRoute extends EpRoute {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;

    get store() {
        return this.perusteDataStore;
    }

    get peruste() {
        return this.store.peruste!;
    }

    get perusteId() {
        return this.store.peruste!.id!;
    }
}

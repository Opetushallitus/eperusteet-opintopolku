import Vue from 'vue';
import { createLogger } from '../utils/logger';
import { Kielet } from '../stores/kieli';

const logger = createLogger('Kaannos');

declare module 'vue/types/vue' {
  interface Vue {
    $vahvista: (title?: string, msg?: string) => Promise<boolean>;
  }
}

export class Vahvistus {
  public static install(vue: typeof Vue) {
    vue.prototype.$vahvista = async function(title = 'vahvista-toiminto', msg = 'vahvista-toiminto-viesti', config: any = {}) {
      return (this as any).$bvModal.msgBoxConfirm(msg, {
        title,
        okVariant: 'danger',
        okTitle: (this as any).$t('kylla') as any,
        cancelVariant: 'link',
        cancelTitle: (this as any).$t('peruuta') as any,
        centered: true,
        ...config,
      });
    };
  }
}

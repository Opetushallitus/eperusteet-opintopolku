import Vue from 'vue';
import _ from 'lodash';
import { createLogger } from '@/stores/logger';
import { Kielet } from '@/stores/kieli';

const logger = createLogger('Kaannos');
const Varoitus = '"$kaanna" on tekstiolioiden kääntämiseen. Käytä vue-i18n vastaavaa funktiota. Esimerkiksi "$t()".';

export class Kaannos {
  public install(vue: typeof Vue) {
    // Sisällön kääntäminen
    vue.prototype.$kaanna = (value: object) => {
      if (!value) {
        return '';
      }
      else if (_.isObject(value)) {
        const locale = Kielet.getSisaltoKieli();
        return (value as any)[locale];
      }
      else {
        logger.warn(Varoitus, 'Käännös:', '"' + value + '"');
        return value;
      }
    };
  }
}

export default new Kaannos();

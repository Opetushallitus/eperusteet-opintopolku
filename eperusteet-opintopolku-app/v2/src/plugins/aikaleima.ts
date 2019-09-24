import Vue from 'vue';
import moment from 'moment';

export class Aikaleima {
  public install(vue: typeof Vue) {
    function aikaleimaFnFactory(this: void, format: string) {
      // eslint-disable-next-line only-arrow-functions
      return function(this: void, value: number) {
        (this as any).$i18n.locale; // eslint-disable-line
        return moment(value).format(format);
      };
    }

    // Long datetime
    vue.prototype.$ldt = aikaleimaFnFactory('LLL');

    // Long date
    vue.prototype.$ld = aikaleimaFnFactory('LL');

    // Long time
    vue.prototype.$lt = aikaleimaFnFactory('H:mm:ss');

    // Short datetime
    vue.prototype.$sdt = aikaleimaFnFactory('D.M.YYYY H:mm');

    // Short date
    vue.prototype.$sd = aikaleimaFnFactory('D.M.YYYY');

    // Short time
    vue.prototype.$st = aikaleimaFnFactory('H:mm');

    // Time until or ago an event counting from now
    vue.prototype.$ago = function(value: number) {
      this.$i18n.locale; // eslint-disable-line
      return moment(value).fromNow();
    };

    // Custom datetime
    vue.prototype.$cdt = function(value: number, format: string) {
      // Pakko olla, jotta localen vaihtuessa komponentti päivittyy
      this.$i18n.locale; // eslint-disable-line
      return moment(value).format(format);
    };
  }
}

export default new Aikaleima();

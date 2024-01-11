import Vue from 'vue';

export class Plaintext {
  public install(vue: typeof Vue) {
    vue.prototype.$plaintext = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '');
  }
};

export default new Plaintext();

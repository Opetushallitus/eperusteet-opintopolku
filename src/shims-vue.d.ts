declare module 'vue' {
  import { CompatVue } from 'vue';
  const Vue: CompatVue;
  export default Vue;
  const { configureCompat } = Vue;
  export { configureCompat };
}

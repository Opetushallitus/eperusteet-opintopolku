const path = require('path');

module.exports = {
  title: 'Default Style Guide',
  defaultExample: false,
  exampleMode: 'expand',
  usageMode: 'expand',
  sections: [{
    name: 'Components',
    description: '',
    components: [
      'src/components/EpCollapse/EpCollapse.vue',
      'src/components/EpButton/EpButton.vue',
      'src/components/EpSpinner/EpSpinner.vue',
      'src/components/EpLinkki.vue',
    ],
  }, {
    name: 'Form components',
    description: 'Custom form components',
    components: 'src/components/forms/Ep*.vue',
  }],
  require: [
    path.join(__dirname, 'config/styleguide.plugins.ts'),
  ],
};

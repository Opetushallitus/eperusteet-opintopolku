module.exports = {
  'hooks': {
    'pre-commit': 'lint-staged && node eperusteet-frontend-utils/vue/scripts/check-versions.js',
  },
};

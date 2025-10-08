const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const { lintModuleConfig } = require('./eperusteet-frontend-utils/vue/eslint.cjs');

module.exports = defineConfig(lintModuleConfig);

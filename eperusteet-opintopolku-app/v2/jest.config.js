module.exports = {
  globals: {
    'ts-jest': {
      tsoConfig: 'tsconfig.json',
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  coverageReporters: [
    'text-summary',
    'json',
    'lcov',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|tsx|vue)',
    '!<rootDir>/src/generated/**/*.ts',
    '!<rootDir>/src/**/script.ts',
    '!<rootDir>/**/*.d.ts',
    '!<rootDir>/src/config/styles.ts',
    '!<rootDir>/src/main.ts',
  ],
  moduleFileExtensions: [
    'vue',
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  'transformIgnorePatterns': [
    '/node_modules/(?!(@katex|vue-masonry|lodash-es|bootstrap-vue|vuelidate-property-decorators|deepdash-es)/)',
  ],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/eperusteet-frontend-utils/vue/src/$1',
    '^@assets/(.*)$': '<rootDir>/eperusteet-frontend-utils/vue/public/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/tests/integration/**/*.spec.(ts|tsx)',
  ],
  testURL: 'http://localhost/',
};

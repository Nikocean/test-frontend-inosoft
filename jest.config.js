// Jest configuration (CommonJS) so it works with Node without ESM flags
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@vue/test-utils$': '@vue/test-utils/dist/vue-test-utils.cjs.js'
  },
  testMatch: [
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    'src/components/atoms/__tests__',
    'src/components/molecules/__tests__'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}

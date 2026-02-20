// Jest setup file

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Ensure Vue is available globally for some test-utils internals
try {
  // eslint-disable-next-line global-require
  const vue = require('vue')
  // Some builds of @vue/test-utils expect global Vue
  global.Vue = vue
} catch (e) {
  // Ignore if Vue cannot be required (should not happen in this project)
}

import Vue from 'vue';

let config = {
  name: 'm',
  element: [''],
  module: [''],
  useElementUI: true,
  useRainbowUi: true,
  router: null,
  store: null,
  app: null,
  APP: Vue,
  setConfig(config = {}) {
    Object.assign(this, config)
  },
  setAPP(APP) {
    this.APP = APP
  },
  setapp(app) {
    this.app = app
  },
  setName(name) {
    this.name = name
  }
};

export default config

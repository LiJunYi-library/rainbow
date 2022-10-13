export default {
  name: 'm',
  element: [''],
  module: [''],
  useElementUI: true,
  useRainbowUi: true,
  setConfig(config = {}) {
    Object.assign(this, config)
  },
  setName(name) {
    this.name = name
  }
};

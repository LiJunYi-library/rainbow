import { apply } from '@rainbow_ljy/jsapi'

export default {
  beforeCreate() {
    const { applys } = this.$options;
    if (!applys) return;
    for (const key in applys) {
      if (Object.hasOwnProperty.call(applys, key)) {
        this[key] = apply(applys[key], this)
      }
    }
  },
};
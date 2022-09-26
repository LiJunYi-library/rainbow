import { applay } from '@rainbow_ljy/jsapi'

export default {
  beforeCreate() {
    const { applys } = this.$options;
    if (!applys) return;
    // 
    for (const key in applys) {
      if (Object.hasOwnProperty.call(applys, key)) {
        this[key] = applay(applys[key], this)
      }
    }
  },
};

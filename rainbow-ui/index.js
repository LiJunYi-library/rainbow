
import components from './components/index'
import prototype from './prototype/index'
import config from './config'
import applys from './mixins/applys';
import open from './directive/open';

components.install = function install(Vue) {
  Vue.mixin(applys);
  Vue.directive('open', open);

  for (const proto in prototype) {
    if (Object.hasOwnProperty.call(prototype, proto)) {
      Vue.prototype[config.name + proto] = prototype[proto]
    }
  }

  for (const key in components) {
    if (Object.hasOwnProperty.call(components, key)) {
      Vue.component(`${config.name}-${key}`, components[key]);
    }
  }
};

const rainbowUi = components;
import fetchOptions from './mixins/fetchOptions'
export { rainbowUi, fetchOptions };

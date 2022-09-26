import config from './config'
import components from './components/index'
import applys from  './mixins/applys'

components.install = function install(app) {
  app.mixin(applys);
  for (const key in components) {
    if (Object.hasOwnProperty.call(components, key)) {
      app.component(`${config.name}-${key}`, components[key]);
    }
  }
};

const rainbowView = components;

export { rainbowView };

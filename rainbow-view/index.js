import config from './config'
import components from './components/index'

components.install = function install(app) {
  for (const key in components) {
    if (Object.hasOwnProperty.call(components, key)) {
      app.component(`${config.name}-${key}`, components[key]);
    }
  }
};

const rainbowView = components;

export { rainbowView };

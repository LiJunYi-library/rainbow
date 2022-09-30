import config from './config'
import components from './components/index'
import { createDialog, dialogElements } from './dialogs'

let dialogs = {};

components.install = function install(app) {
  for (const key in components) {
    if (Object.hasOwnProperty.call(components, key)) {
      app.component(`${config.name}-${key}`, components[key]);
    }
  }

  for (const key in dialogElements) {
    if (Object.hasOwnProperty.call(dialogElements, key)) {
      dialogs[key] = createDialog(dialogElements[key], app._context)
    }
  }
};

const elementPlusLib = components;

export { elementPlusLib, createDialog, dialogs };

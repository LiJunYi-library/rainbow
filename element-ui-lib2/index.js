import config from './config'
import components from './components/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import { rainbowUi } from '@rainbow_ljy/rainbow-ui'
import { useArray } from '@rainbow_ljy/jsapi'
useArray()

components.install = function install(APP) {
  config.setAPP(APP)

  if (config.useElementUI) APP.use(ElementUI, { locale })
  if (config.useRainbowUi) APP.use(rainbowUi)

  for (const key in components) {
    if (Object.hasOwnProperty.call(components, key)) {
      APP.component(`${config.name}-${key}`, components[key]);
    }
  }
};

const elementUiLib = components;

export * from './dialogs/createDialog';
export * from './dialogs'
export { elementUiLib, config };



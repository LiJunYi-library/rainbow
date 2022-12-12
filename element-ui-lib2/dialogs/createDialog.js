
import AppConfig from '../config'

export function createDialog(template, defaultOptions = {}, app = AppConfig.APP) {
  const LogConstructor = app.extend(template);

  let instance;

  const initInstance = () => {
    instance = new LogConstructor({
      router: AppConfig.router,
      store: AppConfig.store,
      el: document.createElement('div'),
    });
  };

  const merge = (tart = {}, config = {}) => {
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        tart[key] = config[key];
      }
    }
  }

  const dialog = function (options = {}, callback) {
    if (!instance) {
      initInstance()
    }
    return new Promise((resolve, reject) => {
      document.body.appendChild(instance.$el)
      const config = Object.assign(defaultOptions, options)
      merge(instance, config)
      instance.visible = true
      instance.resolve = (res) => {
        resolve(res)
      }
      instance.reject = (res) => {
        reject(res)
      }
    })
  }

  return dialog
}















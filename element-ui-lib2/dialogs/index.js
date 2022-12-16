
import FromDialog from './from-dialog.vue'
import Dialog from './dialog.vue'
import config from '../config'

let App = config.APP;

export function useDialog(app) {
  App = app;
}

export function translate({ tem, app = App }) {
  return function transform(options = {}) {
    return new Promise((resolve, reject) => {
      const LogConstructor = app.extend(tem);
      let instance;
      let optionsData = {};
      if (options.data) optionsData = options.data()
      instance = new LogConstructor({
        el: document.createElement('div'),
        router: config.router,
        store: config.store,
        ...options,
        data() {
          return {
            ...optionsData,
            resolve,
            reject
          }
        }

      });

    })
  }
}


export function extend({ tem, beforeInstance, afterInstance, app = App }) {
  return function transform(datas = {}, methods = {},) {
    return new Promise((resolve, reject) => {

      const LogConstructor = app.extend(tem);
      let instance;
      if (beforeInstance) beforeInstance(datas, methods)
      instance = new LogConstructor({
        el: document.createElement('div'),
        router: config.router,
        store: config.store,
        data() {
          return {
            ...datas,
            resolve,
            reject
          }
        },
        methods: {
          ...methods
        }
      });
      if (afterInstance) afterInstance(datas, methods, instance)

    })


  }

}

export let fromDialog = extend(
  {
    tem: FromDialog,
    beforeInstance: (datas) => {
      (() => {
        if (!datas.fromItems) return;

        let fromItems = datas.fromItems

        let from_data = {}

        for (const key in fromItems) {
          if (Object.hasOwnProperty.call(fromItems, key)) {
            const ele = fromItems[key];
            let v = ele.value;
            if (v === undefined) v = '';
            from_data[key] = v;
            if (datas.fromData && v) datas.fromData[key] = v;
          }
        }

        if (!datas.fromData) datas.fromData = from_data;
      })()

    }
  });

export let dialog = extend({ tem: Dialog })

export function transformDialog(props = {}) {
  let tem = props.tem;
  let dialogAttrs = props.dialogAttrs || {};
  let app = props.app || App;

  return function transform(options = {}) {
    return new Promise((resolve, reject) => {
      const dialogConstructor = app.extend(Dialog);
      let options_dialogAttrs = options.dialogAttrs || {}
      let dialogInstance = new dialogConstructor({
        el: document.createElement('div'),
        router: config.router,
        store: config.store,
        data() {
          return {
            diaAttrs: {
              'close-on-click-modal': false,
              title: "",
              width: 'auto',
              ...dialogAttrs,
              ...options_dialogAttrs,
            }
          }
        }
      });

      if (!tem) return;
      dialogInstance.renderContent = (vm) => {
        let options_props = options.props || {}
        return vm.$createElement(tem, {
          ...options,
          props: {
            myProp: 'bar',
            resolve,
            reject,
            close: () => vm.visible = false,
            ...options_props
          },
        })
      }
    })
  }
}

export { FromDialog, Dialog };



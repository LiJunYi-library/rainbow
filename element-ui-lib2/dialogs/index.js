import Vue from 'vue';
import FromDialog from './from-dialog.vue'
import Dialog from './dialog.vue'


let App = Vue;

export function useDialog(app) {
  App = app;
}

export function extend({ tem, beforeInstance, afterInstance, app = App }) {
  return function transform(datas = {}, methods = {},) {
    return new Promise((resolve, reject) => {

      const LogConstructor = app.extend(tem);
      let instance;
      if (beforeInstance) beforeInstance(datas, methods)
      instance = new LogConstructor({
        el: document.createElement('div'),
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

export { FromDialog, Dialog };



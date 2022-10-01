import { AppContext, createVNode, DefineComponent, render, resolveComponent, VNode } from 'vue';

export function createDialog(com, context) {
  let dialogNode;

  const createDialogNode = (attrs = {}) => {
    dialogNode = createVNode(com, attrs);
    dialogNode.appContext = context;
    const hl = document.createElement('div');
    render(dialogNode, hl);
  };


  const merge = (tart = {}, config = {}) => {
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        tart[key] = config[key];
      }
    }
  }

  const handleProxy = (data = {}, resolve, reject) => {
    const proxy = dialogNode.component?.proxy;
    proxy.visible = true;
    proxy.resolve = resolve;
    proxy.reject = reject;
    merge(proxy, data);
  };

  const dialog = function (data = {}) {
    console.log('*************dialog', context);
    // return new Promise((resolve, reject) => {
    //   if (!dialogNode) createDialogNode();
    //   handleProxy(data, resolve, reject)
    // })

  };

  return dialog;
}




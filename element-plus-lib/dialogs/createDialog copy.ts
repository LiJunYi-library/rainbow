import { AppContext, createVNode, DefineComponent, render, resolveComponent, VNode } from 'vue';

export function createDialog(com: any, context: AppContext | null) {
  let dialogNode: VNode;

  const createDialogNode = (attrs = {}) => {
    dialogNode = createVNode(com, attrs);
    dialogNode.appContext = context;
    const hl = document.createElement('div');
    render(dialogNode, hl);
  };


  const merge = (tart: any = {}, config: any = {}) => {
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        tart[key] = config[key];
      }
    }
  }

  const handleProxy = (data: any = {}, resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    const proxy: any = dialogNode.component?.proxy;
    proxy.visible = true;
    proxy.resolve = resolve;
    proxy.reject = reject;
    merge(proxy, data);
  };

  const dialog = function (data = {}) {
    return new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      if (!dialogNode) createDialogNode();
      handleProxy(data, resolve, reject)
    })

  };

  return dialog;
}




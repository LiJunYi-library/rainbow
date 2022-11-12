import FromDialog from './from-dialog.vue';
import Dialog from './dialog.vue'


export type ExtendConfig = {
  tem: any,
  beforeInstance?: (datas?: any, methods?: any) => void,
  afterInstance?: (datas?: any, methods?: any, instance?: any) => void,
  app?: any,
}

export declare function useDialog(app: any): void;

export declare function extend(config: ExtendConfig)

export declare function fromDialog(datas?: any, funs?: any);

export declare function dialog(datas?: any, funs?: any);

export { FromDialog, Dialog };


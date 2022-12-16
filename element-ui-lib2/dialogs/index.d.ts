import FromDialog from './from-dialog.vue';
import Dialog from './dialog.vue'


export type ExtendConfig = {
  tem: any,
  beforeInstance?: (datas?: any, methods?: any) => void,
  afterInstance?: (datas?: any, methods?: any, instance?: any) => void,
  app?: any,
}

export type TransformDialogProps = {
  tem: any,
  dialogAttrs?: any,
  app?: any,
}

export type transformDialogAlert = {
  (options?: any,): Promise<any>;
}



export declare function useDialog(app: any): void;

export declare function extend(config: ExtendConfig);

export declare function translate(config: ExtendConfig)

export declare function fromDialog(datas?: any, funs?: any);

export declare function dialog(datas?: any, funs?: any);

export declare function transformDialog(props: TransformDialogProps): transformDialogAlert;

export { FromDialog, Dialog };


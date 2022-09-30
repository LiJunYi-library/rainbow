import { AppContext, createVNode, DefineComponent, render, resolveComponent, VNode } from 'vue';

declare type Element = {
  install(app: any): void
}

declare const elementPlusLib: Element;

declare type dialog = {
  (data: any): Promise<void>
}

declare function createDialog(com: any, context: AppContext | null): dialog

declare type Dialogs = {
  test: dialog
}

declare const dialogs: Dialogs;

export { elementPlusLib, createDialog, dialogs };
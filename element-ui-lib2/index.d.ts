
declare type Element = {
  install(vue: any): void
}

declare const elementUiLib: Element;

import { createDialog } from './dialogs/createDialog';

export * from './dialogs/index'

export { elementUiLib, createDialog };
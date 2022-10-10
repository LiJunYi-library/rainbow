
declare type Dialog = {
  (options: any, callback?: () => void): Promise<void>
}

export declare function createDialog(template: any, defaultOptions?: any): Dialog;


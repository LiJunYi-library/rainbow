

declare type Element = {
  install(vue: any): void
}

declare type FetchOptions = {
  props: {}
}

declare const rainbowUi: Element;

declare const fetchOptions: FetchOptions;

export { rainbowUi, fetchOptions };
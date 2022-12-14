import Vue from 'vue';

export declare type Config = {
  name?: string,
  element?: string[],
  module?: string[],
  useElementUI?: boolean,
  useRainbowUi?: boolean,
  router?: any,
  store?: any,
  app?: any,
  APP?: any,
  setConfig?: (config: Config) => void,
  setAPP?: (APP: any) => void,
  setapp?: (app: any) => void,
  setName?: (app: string) => void,
}


declare const config: Config;

export default config

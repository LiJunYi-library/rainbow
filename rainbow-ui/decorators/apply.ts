import { createDecorator } from 'vue-class-component';

export function Apply(): any {
  return createDecorator((componentOptions, key) => {
    const options = componentOptions as any;
    if (!options.applys) {
      options.applys = {}
    }
    const method = options.methods[key];
    options.applys[key] = method;
    delete options.methods[key];
  });
}


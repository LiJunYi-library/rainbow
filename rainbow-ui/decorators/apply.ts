

export function apply(...arg): any {
  // return function (
  //   target: BaseVue,
  //   key: string,
  //   descriptor: PropertyDescriptor
  // ) {
  //   const method = descriptor.value;
  //   descriptor.value = async function (data: AnyObject) {
  //     const params = this[dataKey] || data;
  //     const res = await request({ method: 'get', url: url, params }, config);
  //     const rest = method.call(this, res);
  //     if (rest) return rest;
  //     return res;
  //   };
  // }
}
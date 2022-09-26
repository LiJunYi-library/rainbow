export function objectFilter(object = {}, regExp) {
  let o = {};
  for (const key in object) {
    if (object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      if (regExp.test(key)) {
        let pro = key.replace(regExp, "");
        o[pro] = element;
      }
    }
  }
  return o;
}


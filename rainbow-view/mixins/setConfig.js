export function setConfig(attrsKty = [], propsKty = []) {
  // eslint-disable-next-line
  for (const key in this.$props) {
    if (Object.prototype.hasOwnProperty.call(this.$props, key)) {
      const element = this.$props[key];
      if (!propsKty.includes(key)) this.config[key] = element;
    }
  }

  // eslint-disable-next-line
  for (const key in this.$attrs) {
    if (Object.prototype.hasOwnProperty.call(this.$attrs, key)) {
      const element = this.$attrs[key];
      if (!attrsKty.includes(key))
        if (!/_/.test(key)) {
          this.config[key] = element;
        } else {
          // eslint-disable-next-line
          const evalKey = key.replace('_', '.');
          const evalKeyarr = key.split('_');
          const recursion = (num, object) => {
            if (num >= evalKeyarr.length) return;
            let keyIndex = num;
            const obj = object;
            const keydd = evalKeyarr[keyIndex];
            if (num === evalKeyarr.length - 1) {
              obj[keydd] = element;
            }
            if (obj[keydd] === undefined) obj[keydd] = {};
            // eslint-disable-next-line
            keyIndex++;
            recursion(keyIndex, obj[keydd]);
          };
          recursion(0, this.config);
        }

      //
    }
  }
}
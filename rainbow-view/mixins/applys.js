export default {
  beforeCreate() {
    const { applys } = this.$options;
    if (!applys) return;
    // 
    for (const key in applys) {
      if (Object.hasOwnProperty.call(applys, key)) {
        const method = function (...params) {
          return applys[key].call(this, ...params);
        }
        method.onApplyListener = [];
        method.afterApplyListener = [];
        method.addOnApplyListener = fun => {
          method.onApplyListener.push(fun);
        };
        method.removeOnApplyListener = fun => {
          const index = method.onApplyListener.findIndex(el => el === fun);
          if (index !== -1) method.onApplyListener.splice(index, 1);
        };
        method.addAfterApplyListener = fun => {
          method.afterApplyListener.push(fun);
        };
        method.removeAfterApplyListener = fun => {
          const index = method.afterApplyListener.findIndex(el => el === fun);
          if (index !== -1) method.afterApplyListener.splice(index, 1);
        };

        this[key] = new Proxy(method, {
          async apply(target, thisArg, argumentsList) {
            //
            if (target.onApply) target.onApply(thisArg, argumentsList);
            if (target.onApplyListener) {
              target.onApplyListener.forEach(fun => {
                fun(thisArg, argumentsList);
              });
            }
            //
            const res = target.apply(thisArg, argumentsList);
            if (target.afterApply) {
              target.afterApply(res, thisArg, argumentsList);
            }
            if (target.afterApplyListener) {
              target.afterApplyListener.forEach(fun => {
                fun(res, thisArg, argumentsList);
              });
            }
            //
            return res;
          },
        });
      }
    }
  },
};

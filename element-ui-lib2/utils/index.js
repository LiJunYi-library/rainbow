export function renderSlot(name = "default", props, callback, vNode) {
  if (this.$slots[name]) return this.$slots[name];
  if (this.$scopedSlots[name]) return this.$scopedSlots[name](props);
  if (callback instanceof Function) return callback(props);
  if (vNode) return vNode;
  return null;
}

export function renderScopedSlots(name = "default", callback, vNode) {
  // console.log('slots', this.$slots[name]);
  if (this.$slots[name]) return (parms) => this.$slots[name];
  // console.log('scopedSlots');
  if (this.$scopedSlots[name]) return (parms) => this.$scopedSlots[name](parms);
  // console.log('callback');
  if (callback instanceof Function) return (parms) => callback(parms);
  // console.log('vNode');
  if (vNode) return vNode;
  return null;
}
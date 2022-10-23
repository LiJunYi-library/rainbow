export function renderSlot(name = "default", props, callback, vNode) {
  if (this.$slots[name]) return this.$slots[name];
  if (this.$scopedSlots[name]) return this.$scopedSlots[name](props);
  if (callback instanceof Function) return callback(props);
  if (vNode) return vNode;
  return null;
}

export function renderScopedSlots(name = "default", callback, vNode) {
  if (this.$slots[name]) return this.$slots[name];
  if (this.$scopedSlots[name]) return (parms) => this.$scopedSlots[name](parms);
  if (callback instanceof Function) return (parms) => callback(parms);
  if (vNode) return vNode;
  return null;
}
function upperFirstCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export default {
  props: {
    loadingMessage: {type: String, default: ''},
    loadingMessageType: {type: String, default: 'warning'},
    loading: [Boolean, Number],
  },
  watch: {
    loading() {
      this.loading_ = this.loading;
    },
  },
  data() {
    return {
      loading_: false,
    };
  },
  asyncEvent: ['click'],
  beforeCreate() {
    const up = upperFirstCase;

    this.$options.asyncEvent.forEach(eName => {
      const verifyKey = `verify${up(eName)}`;
      const beforeKey = `before${up(eName)}`;
      const loadingKey = `loading${up(eName)}`;
      const afterKey = `after${up(eName)}`;
      const eventName = `onAsync${up(eName)}`;
      const event = this.$listeners[eName];

      async function invoker(...arg) {
        if (this[verifyKey]) {
          const res = await this[verifyKey](...arg);
          if (res === false) return;
        }

        this.$emit(beforeKey, this.loading_, ...arg);
        if (this.loading_) {
          this.$emit(loadingKey, this.loading_);
          if (this.loadingMessage) {
            this.$message({
              message: this.loadingMessage,
              type: this.loadingMessageType,
            });
          }
          return;
        }

        this.loading_ = true;
        this.$emit('update:loading', true);
        let pro;
        if (event) pro = event(...arg);
        if (pro instanceof Promise) {
          pro.finally(() => {
            this.loading_ = false;
            this.$emit('update:loading', false);
            this.$emit(afterKey, false, ...arg);
          });
        } else {
          this.loading_ = false;
          this.$emit('update:loading', false);
          this.$emit(afterKey, false, ...arg);
        }
      }

      this[eventName] = ((...arg) => invoker.bind(this, ...arg))();
    });
  },
};

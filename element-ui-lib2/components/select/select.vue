<script>
export default {
  props: {
    value: [String, Number, Object, Array],
  },
  data() {
    return {};
  },
  methods: {
    bindDefaultAttrs() {
      return {};
    },

    renderDefaultSlot() {
      if (this.$scopedSlots.default) {
        return (props) => {
          return this.$scopedSlots.default(props);
        };
      }
      return (props) => this.renderDefault(props);
    },

    renderDefault(props) {
      return null;
    },

    renderPrefixSlot() {
      if (this.$scopedSlots.prefix) {
        return (props) => {
          return this.$scopedSlots.prefix(props);
        };
      }
      return (props) => this.renderPrefix(props);
    },

    renderPrefix(props) {
      return null;
    },

    renderEmptySlot() {
      if (this.$scopedSlots.empty) {
        return (props) => {
          return this.$scopedSlots.empty(props);
        };
      }
      return (props) => this.renderEmpty(props);
    },

    renderEmpty(props) {
      return null;
    },

    emitInput(value) {
      this.$emit("input", value);
    },

    renderElement() {
      return this.$createElement("el-select", {
        attrs: {
          clearable: true,
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
          value: this.value,
        },
        on: {
          ...this.$listeners,
          input: (value) => this.emitInput(value),
        },
        scopedSlots: {
          default: this.renderDefaultSlot(),
          prefix: this.renderPrefixSlot(),
          empty: this.renderEmptySlot(),
        },
      });
    },

    renderStrat() {
      if (this.$slots.start) return this.$slots.start;
      if (this.$scopedSlots.start) {
        return this.$scopedSlots.start({ value: this.value });
      }
      return null;
    },

    renderEnd() {
      if (this.$slots.end) return this.$slots.end;
      if (this.$scopedSlots.end) {
        return this.$scopedSlots.end({ value: this.value });
      }
      return null;
    },
  },
  render() {
    return (
      <div class="el-lib-select">
        {this.renderStrat()}
        {this.renderElement()}
        {this.renderEnd()}
      </div>
    );
  },
};
</script>
<style>
.el-lib-select {
  display: inline-flex;
}
</style>
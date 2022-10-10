<script>
export default {
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
  },
  render() {
    return this.$createElement("el-select", {
      attrs: {
        clearable: true,
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
      },
      on: {
        ...this.$listeners,
      },
      scopedSlots: {
        default: this.renderDefaultSlot(),
        prefix: this.renderPrefixSlot(),
        empty: this.renderEmptySlot(),
      },
    });
  },
};
</script>
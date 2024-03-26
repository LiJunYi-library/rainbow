<script>
export default {
  props: {
    value: [String, Number, Object, Array, Boolean],
    trigger: Boolean,
    label: String,
    className: String,
    multiple: Boolean,
    popoverTitle: String,
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

    bindDefaultEvents() {
      return {};
    },

    onChange(val) {
      console.log(">>>>>>", val);
      this.$emit("change", val);
    },

    renderElement() {
      return this.$createElement("el-select", {
        ref: "el-select",
        attrs: {
          clearable: true,
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
          multiple: this.multiple,
          value: this.value,
        },
        on: {
          ...this.bindDefaultEvents(),
          ...this.$listeners,
          input: (value) => this.emitInput(value),
          change: (value) => this.onChange(value),
          "visible-change": (value) => this.onVisibleChange(value),
        },
        scopedSlots: {
          default: this.renderDefaultSlot(),
          prefix: this.renderPrefixSlot(),
          empty: this.renderEmptySlot(),
        },
        ...this.bindDefaultProperty(),
      });
    },

    onVisibleChange(bool) {
      this.$emit("visible-change");
      if (bool) this.$emit("visible-show");
      else this.$emit("visible-hide");
    },

    bindDefaultProperty() {
      return {};
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
    const disabled = (() => {
      if (!this.multiple) return true;
      if (this.value && this.value.length) return false;
      return true;
    })();

    const selected = (() => {
      if (!this.multiple) return [];
      if (!this.$refs["el-select"]) return [];
      let vms = this.$refs["el-select"].selected;
      if (!vms) return [];
      if (!(vms instanceof Array)) return [];
      return vms;
    })();
    // console.log(this.$refs);
    return (
      <el-popover
        disabled={disabled}
        placement="top-start"
        title={this.popoverTitle || this.label}
        width="200"
        class="el-lib-select-popover"
        trigger="hover"
      >
        <div>
          {selected.map((el) => (
            <div>{el.label}</div>
          ))}
        </div>

        <div slot="reference" class={"el-lib-select " + this.className}>
          {this.label && <div class="label">{this.label}</div>}
          {this.renderStrat()}
          {this.renderElement()}
          {this.renderEnd()}
        </div>
      </el-popover>
    );
  },
};
</script>
<style>
.el-lib-select {
  display: inline-flex;
  align-items: center;
}

.el-lib-select .label {
  white-space: nowrap;
}

.el-lib-select {
  min-width: 100px;
}

.el-lib-select-popover {
  display: inline-block;
}
</style>

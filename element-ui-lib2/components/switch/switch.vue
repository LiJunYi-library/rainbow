<script>
export default {
  props: {
    verify: {
      type: Function,
      default() {
        return true;
      },
    },
    value: [String, Number, Array, Boolean, Object],
  },
  render() {
    return this.$createElement("el-switch", {
      attrs: {
        ...this.$attrs,
        value: this.value,
      },
      on: {
        ...this.$listeners,
        input: async (value) => {
          let res = await this.verify(value);
          if (res) this.$emit("input", value);
        },
      },
    });
  },
};
</script>
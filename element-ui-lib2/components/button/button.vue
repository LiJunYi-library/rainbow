<script>
export default {
  methods: {
    bindDefaultAttrs() {
      return {};
    },
  },
  render() {
    return this.$createElement(
      "el-button",
      {
        attrs: {
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
        },
        on:{
          ...this.$listeners,
        }
      },
      this.$slots.default
    );
  },
};
</script>
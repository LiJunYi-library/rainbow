<script>
import base from "../../mixins/base";
export default {
  mixins: [base],
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
        on: {
          ...this.$listeners,
        },
        ...this.bindDefaultProperty(),
      },
      this.$slots.default
    );
  },
};
</script>
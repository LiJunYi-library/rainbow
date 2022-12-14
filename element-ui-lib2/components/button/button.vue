<script>
import base from "../../mixins/base";
export default {
  mixins: [base],
  methods: {
    bindDefaultAttrs() {
      return {};
    },
    bindDefaultEvents() {
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
          ...this.bindDefaultEvents(),
          ...this.$listeners,
        },
        ...this.bindDefaultProperty(),
      },
      this.$slots.default
    );
  },
};
</script>
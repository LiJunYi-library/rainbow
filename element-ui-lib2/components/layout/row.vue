<script>
import { renderSlot, renderScopedSlots } from "../../utils";
export default {
  render() {
    return this.$createElement(
      "el-row",
      {
        attrs: {
          type: "flex",
          align: "middle",
          justify: "center",
          ...this.$attrs,
        },
      },
      [renderSlot.call(this)]
    );
  },
};
</script>


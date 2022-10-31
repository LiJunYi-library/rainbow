<script>
import { renderSlot, renderScopedSlots } from "../../utils";
import base from "../../mixins/base";
export default {
  mixins: [base],
  render() {
    return this.$createElement("el-form", {
      attrs: {
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
      },
      scopedSlots: {
        default: renderScopedSlots.call(this, "default", this.renderDefault),
      },
    });
  },
  methods: {
    renderDefault() {
      return null;
    },
  },
};
</script>
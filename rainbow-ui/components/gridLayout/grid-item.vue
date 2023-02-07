<script>
import { renderSlot } from "../../utils/index";

export default {
  type: "grid-item",
  name: "grid-item",
  props: {
    width: { type: Number, default: 400 },
  },
  created() {
    this.$parent.gridItems.push(this);
    // console.log(this);
  },
  destroyed() {
    this.$parent.gridItems.remove(this);
    // console.log('destroyed', this.$parent);
  },
  mounted() {},
  render(h) {
    return null;
    // return renderSlot.call(this, "default");
  },
};
</script>
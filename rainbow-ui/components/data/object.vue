<script>
import { renderSlot } from "../../utils";

export default {
  inject: {
    rbObject: { default: () => ({ prototypes: {} }) },
    rbArray: { default: () => ({ prototypes: [] }) },
  },
  provide() {
    return {
      rbObject: this,
    };
  },
  props: {
    prototypes: { type: Object, default: () => ({}) },
    lable: String,
  },
  data() {
    return {
      // prototypes: {},
    };
  },
  render() {
    return <div class="rb-object">{renderSlot.call(this)}</div>;
  },
};
</script>
<style>
.rb-object {
  display: inline-flex;
}
</style>
<script>
import { renderSlot, renderScopedSlots } from "../../utils";
export default {
  props: {
    label: String,
    symbol: {
      type: String,
      default: ":",
    },
  },
  render() {
    return (
      <div class="el-lib-explain">
        {this.label && <span class="label">{this.label}</span>}
        {this.label && <span class="symbol">{this.symbol}</span>}
        {renderSlot.call(this)}
      </div>
    );
  },
};
</script>
<style lang="scss">
.el-lib-explain {
  display: inline-flex;
  align-items: flex-start;
  .symbol {
    margin: 0 3px;
  }
  .label{
    white-space:nowrap;
  }
}
</style>
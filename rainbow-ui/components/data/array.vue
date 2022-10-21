<script>
import { renderSlot } from "../../utils";
export default {
  inject: {
    rbObject: { default: () => ({ prototypes: {} }) },
    rbArray: { default: () => ({ prototypes: [] }) },
  },
  props: {
    prototypes: Array,
    lable: String,
    prop: String,
    divide: { type: String, default: ":" },
    itemDivide: { type: String, default: "、" },
  },
  computed: {
    valueData() {
      if (this.prototypes) return this.prototypes;
      if (!this.rbObject) return [];
      if (!this.prop) return [];
      if (!this.rbObject.prototypes) return [];
      return this.rbObject.prototypes[this.prop];
    },
  },
  render() {
    return (
      <div class="rb-array">
        {renderSlot.call(
          this,
          "lable",
          this.valueData,
          null,
          <span>{this.lable}</span>
        )}
        {renderSlot.call(
          this,
          "divide",
          this.valueData,
          null,
          <span class="rb-divide">{this.divide}</span>
        )}
        {renderSlot.call(this, "default", this.valueData, null, [
          this.valueData
            .map((el, index) => [
              index !== 0 &&
                renderSlot.call(
                  this,
                  "divide",
                  el,
                  null,
                  <span class="rb-item-divide">{this.itemDivide}</span>
                ),
              <span>{el}</span>,
            ])
            .filter(Boolean),
        ])}
      </div>
    );
  },
};
</script>
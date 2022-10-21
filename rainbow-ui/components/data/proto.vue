<script>
import { renderSlot } from "../../utils";
export default {
  inject: {
    rbObject: { default: () => ({ prototypes: {} }) },
  },
  props: {
    prop: String,
    lable: String,
    divide: { type: String, default: ":" },
  },
  data() {
    return {
      value: "",
    };
  },
  computed: {
    valueData() {
      if (!this.rbObject) return "";
      if (!this.prop) return "";
      if (!this.rbObject.prototypes) return "";
      console.log( this.rbObject.prototypes[this.prop]);
      return this.rbObject.prototypes[this.prop];
    },
  },
  created() {},
  mounted() {},
  render() {
    return (
      <div class="rb-prop">
        {renderSlot.call(this, "start", this.valueData, null)}
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
        {renderSlot.call(
          this,
          "default",
          this.valueData,
          null,
          <span>{this.valueData}</span>
        )}
        {renderSlot.call(this, "end", this.valueData, null)}
      </div>
    );
  },
};
</script>
<style>
.rb-prop {
  display: inline-flex;
  align-items: center;
  align-content: center;
  /* line-height: 20px; */
}
.rb-divide {
  margin: 0 5px;
}
</style>
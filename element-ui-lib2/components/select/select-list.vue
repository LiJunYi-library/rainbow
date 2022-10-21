<script>
import Select from "./select.vue";
import dataOptions from "../../mixins/dataOptions";
export default {
  extends: Select,
  mixins: [dataOptions],
  props: {
    formatterLabel: {
      type: Function,
      default: (item) => {
        if (!item) return "";
        if (item instanceof Object) return item.label;
        return item;
      },
    },

    formatterValue: {
      type: Function,
      default: (item) => {
        if (!item) return "";
        if (item instanceof Object) return item.value;
        return item;
      },
    },

    formatterContent: {
      type: Function,
      default: (item) => {
        return null;
      },
    },

    formatterDisabled: {
      type: Function,
      default: (item) => {
        return false;
      },
    },
  },
  data() {
    return {
      currentData: undefined,
    };
  },
  created() {
    if (this.value && this.trigger) this.emitInput(this.value);
  },
  methods: {
    emitInput(value) {
      this.currentData = undefined;
      if (this.data_) {
        this.currentData = this.data_.find(
          (el) => value === this.formatterValue(el)
        );
      }
      this.$emit("input", value);
      this.$emit("update:currentItem", this.currentData);
    },
    bindDefaultAttrs() {
      return {};
    },
    onChange(val) {
      this.$emit("change", val, this.currentData);
    },
    renderDefaultSlot(props) {
      if (!this.data_) return null;
      return (props) =>
        this.data_.map((el) => (
          <el-option
            label={this.formatterLabel(el)}
            value={this.formatterValue(el)}
            disabled={this.formatterDisabled(el)}
          >
            {this.renderItem(el)}
          </el-option>
        ));
    },
    renderItem(item) {
      if (this.$scopedSlots.default) return this.$scopedSlots.default({ item });
      return this.formatterContent(item);
    },
  },
};
</script>
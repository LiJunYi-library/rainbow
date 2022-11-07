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
    currentItem: [String, Number, Object, Array],
    selectIndex: { type: Number, default: -1 },
    triggerSelectIndex: Boolean,
  },
  data() {
    return {
      currentData: this.currentItem,
    };
  },
  created() {
    this.initcreated();
  },
  watch: {
    data() {
      this.data_ = this.data;
      this.initcreated();
    },
  },
  methods: {
    initcreated() {
      if (this.value && this.trigger) this.emitInput(this.value);
      if (this.triggerSelectIndex && this.selectIndex >= 0) {
        this.currentData = this.data_[this.selectIndex];
        let value = this.formatterValue(this.currentData);
        this.$emit("input", value);
        this.$emit("update:currentItem", this.currentData);
      }
    },

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
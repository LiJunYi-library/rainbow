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
  methods: {
    bindDefaultAttrs() {
      return {};
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
<script>
import dataOptions from "../../mixins/dataOptions";
import checkboxGroup from "./checkbox-group.vue";

export default {
  extends: checkboxGroup,
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
  },
  methods: {
    bindDefaultAttrs() {
      return {};
    },
    renderDefaultSlot(props) {
      if (!this.data_) return null;
      return (props) =>
        this.data_.map((el) => (
          <el-checkbox label={this.formatterLabel(el)}>
            {this.renderItem(el)}
          </el-checkbox>
        ));
    },
    renderItem(item) {
      if (this.$scopedSlots.default) return this.$scopedSlots.default({ item });
      return this.formatterValue(item);
    },
  },
};
</script>
<style>
.el-checkbox-list {
  display: flex;
}
.el-checkbox-list .title {
  padding-top: 8px;
  padding-right: 10px;
}
.el-checkbox-list .checkbox {
  flex: 1;
  display: flex;
}
.el-checkbox-list .all {
  padding-right: 10px;
}
.el-checkbox-list .groups {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
</style>


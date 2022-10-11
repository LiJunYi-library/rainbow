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
    isCheckAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: this.isCheckAll,
    };
  },
  watch: {
    isCheckAll() {
      this.checkAll = this.isCheckAll;
      this.handleState();
    },
  },
  created() {
    this.handleState();
  },

  methods: {
    bindDefaultAttrs() {
      return {};
    },
    handleState() {
      if (!this.data_) return;
      if (!this.data_.length) return;
      if (this.checkAll) {
        let arr = [];
        arr = this.data_.map((item) => this.formatterValue(item));
        this.$emit("input", arr);
        return;
      }

      let vm = this;
      vm.checkAll = vm.value.length === vm.data_.length;
      vm.isIndeterminate = vm.value.length !== vm.data_.length;
      if (vm.checkAll) vm.isIndeterminate = false;
      if (!vm.value.length) vm.isIndeterminate = false;
    },
    renderAllCheckbox() {
      let vm = this;
      return this.$createElement(
        "el-checkbox",
        {
          attrs: {
            indeterminate: this.isIndeterminate,
            value: this.checkAll,
          },
          on: {
            input: (value) => {
              vm.isIndeterminate = false;
              vm.checkAll = value;
              let arr = [];
              if (value) arr = vm.data_.map((item) => vm.formatterValue(item));
              vm.$emit("input", arr);
            },
          },
        },
        "全选"
      );
    },
    renderGroup() {
      let vm = this;
      return this.$createElement("el-checkbox-group", {
        attrs: {
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
          value: this.value,
        },
        on: {
          ...this.$listeners,
          input: (value) => {
            vm.checkAll = value.length === vm.data_.length;
            vm.isIndeterminate = value.length !== vm.data_.length;
            if (vm.checkAll) vm.isIndeterminate = false;
            if (!value.length) vm.isIndeterminate = false;
            vm.$emit("input", value);
          },
        },
        scopedSlots: {
          default: this.renderDefaultSlot(),
        },
      });
    },
    renderDefaultSlot(props) {
      if (!this.data_) return null;
      return (props) =>
        this.data_.map((el) => (
          <el-checkbox label={this.formatterValue(el)}>
            {this.renderItem(el)}
          </el-checkbox>
        ));
    },
    renderItem(item) {
      if (this.$scopedSlots.default) return this.$scopedSlots.default({ item });
      return this.formatterLabel(item);
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


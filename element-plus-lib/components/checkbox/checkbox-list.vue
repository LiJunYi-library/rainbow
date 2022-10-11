<script>
import fetchOptions from "../../mixins/fetchOptions.js";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  provide() {
    return {
      checkboxList: this,
    };
  },
  props: {
    title: { type: String, default: "标题" },
    allLabel: { type: String, default: "全部" },
    showAll: { type: Boolean, default: true },
    checkAll: { type: Boolean, default: false },
    checkList: { type: Array, default: () => [] },
    list: { type: Array, default: () => [] },
    modelValue: [String, Array, Object, Number],

    fomatterModelValue: {
      type: Function,
      default: (list) => {
        if (!list) return "";
        if (list instanceof Array) return list.toString();
        return "";
      },
    },

    fomatterLabel: {
      type: Function,
      default: (item) => {
        return item.label || "";
      },
    },

    fomatterValue: {
      type: Function,
      default: (item) => {
        return item.value || "";
      },
    },
  },
  emits: [
    "update:modelValue",
    "update:checkAll",
    "update:checkList",
    "change",
    "changeAll",
    "changeItem",
  ],
  data() {
    return {
      checkAll_: this.checkAll,
      isIndeterminate: false,
      checkedList: this.checkList,
      arrayList: this.list,
      bindLoading: null,
    };
  },
  watch: {
    checkAll(newV) {
      this.checkAll_ = newV;
      this.checkedList = newV ? this.arrayList.map(this.fomatterValue) : [];
      this.$emit("update:checkList", this.checkedList);
      // console.log(
      //   ">>>>>>>>>>> modelValue  ",
      //   this.fomatterModelValue(this.checkedList)
      // );
      this.$emit(
        "update:modelValue",
        this.fomatterModelValue(this.checkedList)
      );
    },
    checkList(newV) {
      // console.log(">>>>>>>>>>> watch  checkList", newV);
      this.checkedList = newV;
      if (newV.length === 0) {
        this.isIndeterminate = false;
        this.checkAll_ = false;
        //TODO this.$emit("update:checkAll", this.checkAll_);
        this.$emit(
          "update:modelValue",
          this.fomatterModelValue(this.checkedList)
        );
        return;
      }
      this.checkAll_ = this.checkedList.length === this.arrayList.length;
      this.isIndeterminate = this.checkedList.length !== this.arrayList.length;
      //TODO this.$emit("update:checkAll", this.checkAll_);
      this.$emit(
        "update:modelValue",
        this.fomatterModelValue(this.checkedList)
      );
    },
  },
  created() {
    // console.log(">>>>>>>>>>> created", this);
    if (this.checkAll_ === true) this.handleCheckAllChange(true);
  },
  methods: {
    handleCheckAllChange(val, event) {
      // console.log(">>>>>>>>>>> handleCheckAllChange", val, event);
      this.checkedList = val ? this.arrayList.map(this.fomatterValue) : [];
      this.isIndeterminate = false;
      this.$emit("update:checkAll", this.checkAll_);
      this.$emit("update:checkList", this.checkedList);
      // console.log(
      //   ">>>>>>>>>>> modelValue  ",
      //   this.fomatterModelValue(this.checkedList)
      // );
      this.$emit(
        "update:modelValue",
        this.fomatterModelValue(this.checkedList)
      );
      if (!event) return;
      this.$emit("change", this.checkedList, this.checkAll_);
      this.$emit("changeAll", this.checkedList, this.checkAll_);
    },
    handleCheckedListChange(value, event) {
      const checkedCount = value.length;
      this.checkAll_ = checkedCount === this.arrayList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.arrayList.length;
      this.$emit("update:checkAll", this.checkAll_);
      this.$emit("update:checkList", this.checkedList);
      // console.log(
      //   ">>>>>>>>>>> modelValue  ",
      //   this.fomatterModelValue(this.checkedList)
      // );
      this.$emit(
        "update:modelValue",
        this.fomatterModelValue(this.checkedList)
      );

      this.$emit("change", this.checkedList, this.checkAll_);
      this.$emit("changeItem", this.checkedList, this.checkAll_);
    },

    renderTitle(...arg) {
      if (this.$slots.title) return this.$slots.title(...arg);
      if (!this.title) return null;
      return this.renderDefaultTitle(...arg);
    },
    
    renderDefaultTitle(...arg) {
      return <div class="title">{this.title}</div>;
    },

    renderAllCheckbox(...arg) {
      return this.renderDefaultAllCheckbox(...arg);
    },
    renderDefaultAllCheckbox() {
      const el_checkbox = resolveComponent("el-checkbox");
      if (!this.showAll) return null;
      return (
        <el-checkbox
          class="all"
          v-model={this.checkAll_}
          indeterminate={this.isIndeterminate}
          onChange={this.handleCheckAllChange}
        >
          {this.allLabel}
        </el-checkbox>
      );
    },

    renderGroup(...arg) {
      return this.renderDefaultGroup(...arg);
    },
    renderDefaultGroup() {
      const el_checkbox_group = resolveComponent("el-checkbox-group");
      // console.log("el_checkbox_group", h(el_checkbox_group));
      return (
        <el-checkbox-group
          ref="ooooooooooooooo"
          class="groups"
          v-model={this.checkedList}
          onChange={this.handleCheckedListChange}
        >
          {this.renderDefault()}
        </el-checkbox-group>
      );
    },

    renderDefault(...arg) {
      // TODO
      if (this.$slots.default) {
        let defaultSolt = this.$slots.default(...arg);
        let list = defaultSolt.map((val) => ({
          value: val?.props?.label ?? undefined,
          label: undefined,
        }));
        // TODO
        // console.log("defaultSolt", list);
        // console.log(" this.isIndeterminate", this.isIndeterminate);
        return defaultSolt;
      }
      return this.arrayList.map((item, index) =>
        this.renderItem(item, index, ...arg)
      );
    },
    renderItem(item, index, ...arg) {
      if (this.$slots.item) return this.$slots.item(item, index, ...arg);
      return this.renderDefaultItem(item, index, ...arg);
    },
    renderDefaultItem(item, index, ...arg) {
      const el_checkbox = resolveComponent("el-checkbox");

      return (
        <el-checkbox key={index} label={this.fomatterValue(item)}>
          {this.fomatterLabel(item)}
        </el-checkbox>
      );
    },

    /////////
  },
  render() {
    let loading = false;
    if (this.bindLoading) loading = this.bindLoading();
    return (
      <div class="el-checkbox-list" v-loading={loading}>
        {[this.renderTitle(), this.renderAllCheckbox(), this.renderGroup()]}
      </div>
    );
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


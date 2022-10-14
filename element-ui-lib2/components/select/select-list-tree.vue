<script>
import SelectList from "./select-list.vue";
import dataOptions from "../../mixins/dataOptions";
export default {
  extends: SelectList,
  mixins: [dataOptions],
  provide() {
    return {
      selectListTree: this,
    };
  },
  inject: {
    selectListTree: { default: null },
  },
  data() {
    return {
      root: null,
      parent: null,
      child: null,
    };
  },
  props: {
    formatterChild: {
      type: Function,
      default(item) {
        if (this.parent) return this.parent.formatterChild(item);
        if (!item) return [];
        if (item instanceof Object) return item.children;
        return item;
      },
    },

    formatterLabel: {
      type: Function,
      default(item) {
        if (this.parent) return this.parent.formatterLabel(item);
        if (!item) return "";
        if (item instanceof Object) return item.label;
        return item;
      },
    },

    formatterValue: {
      type: Function,
      default(item) {
        if (this.parent) return this.parent.formatterValue(item);
        if (!item) return "";
        if (item instanceof Object) return item.value;
        return item;
      },
    },

    formatterContent: {
      type: Function,
      default(item) {
        if (this.parent) return this.parent.formatterContent(item);
        return null;
      },
    },

    currentItem: [String, Number, Object, Array],
    selectIndex: { type: Number, default: -1 },
    triggerSelectIndex: Boolean,
  },
  methods: {
    emitInput(value) {
      this.updateInput(value);
      this.afterUpdateInput(value);
    },

    updateInput(value) {
      this.$emit("input", value);
      let current;
      if (!this.data_) current = undefined;
      else {
        current = this.data_.find((el) => value === this.formatterValue(el));
      }
      this.$emit("update:currentItem", current);
      this.handleChild(current);
    },

    handleChild(currentItem) {
      if (!this.child) return;
      if (!this.child.updateInput) return;
      this.child.data_ = this.formatterChild(currentItem);
      if (
        !(
          this.child.selectIndex >= 0 &&
          this.child.data_ &&
          this.child.data_.length
        )
      ) {
        this.child.updateInput("");
        return;
      }
      // console.log("更新 默认值");
      let current = this.child.data_[this.child.selectIndex];
      let val = this.formatterValue(current);
      this.child.updateInput(val);
    },

    handleChain() {
      if (this.selectListTree) {
        this.selectListTree.child = this;
        this.parent = this.selectListTree;
        this.root = this.parent.root;
      } else {
        this.root = this;
        this.parent = null;
      }
    },

    afterUpdateInput(value) {},

    onTreeMounted() {
      // console.log("当树创建完成");
      this.setSelectIndex();
      this.$emit("treeMounted");
    },

    setSelectIndex() {
      if (!this.triggerSelectIndex) return;
      if (this.selectIndex < 0) return;
      // console.log('setSelectIndex');
      let current = this.data_[this.selectIndex];
      let val = this.formatterValue(current);
      this.$emit("input", val);
      this.$emit("update:currentItem", current);
      if (this.child) {
        this.child.data_ = this.formatterChild(current);
        this.child.setSelectIndex();
      }
    },
  },
  created() {
    this.handleChain();
  },
  mounted() {
    if (this.parent == null) this.onTreeMounted();
  },
  beforeDestroy() {
    if (this.selectListTree) this.selectListTree.child = null;
  },
};
</script>
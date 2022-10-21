<script>
import SelectList from "./select-list.vue";
import dataOptions from "../../mixins/dataOptions";
import { Queue, QueuePromise } from "@rainbow_ljy/jsapi";

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

    formatterDisabled: {
      type: Function,
      default(item) {
        if (this.parent) return this.parent.formatterDisabled(item);
        return false;
      },
    },

    currentItem: [String, Number, Object, Array],
    selectIndex: { type: Number, default: -1 },
    triggerSelectIndex: Boolean,
  },
  data() {
    return {
      root: null,
      parent: null,
      child: null,
      layer: 0,
      isWatch: true,
      watchTime: null,
      currentData: undefined,
      mergeWatchEvent: new QueuePromise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 0);
      }),
      node: null,
    };
  },
  watch: {
    value(newV) {
      if (!this.isWatch) return;
      // console.log("触发了  watch ");
      this.root.margeEvents(newV);
    },
  },
  methods: {
    async margeEvents(newV) {
      await this.mergeWatchEvent;
      // console.log("合并  事件 ");
      this.shieldWatch();
      this.setTreeData();
    },
    shieldWatch() {
      // console.log("屏蔽  watch ");
      this.isWatch = false;
      this.watchTime = setTimeout(() => {
        this.isWatch = true;
        // console.log("不屏蔽  watch ");
      }, 0);
    },

    async emitInput(value) {
      this.shieldWatch();
      this.changeCurrentData(value);
      await this.$emit("update:currentItem", this.currentData);
      await this.$emit("input", value);
      this.$emit("valueChange");
      if (this.child) await this.child.handChild();
      this.$emit("changeTree");
    },

    async handChild() {
      await this.initCurrentTree();
      if (this.child) await this.child.handChild();
    },

    async initCurrentTree() {
      let isCanSetData = (() => {
        if (this.layer === 0 && this.selectIndex >= 0) return true;
        if (!this.parent) return false;
        if (this.parent.currentData) return true;
        return false;
      })();

      if (isCanSetData) await this.setData();
      else this.data_ = [];

      let isReset = (() => {
        if (!this.data_) return true;
        if (!this.data_.length) return true;
        if (!isCanSetData) return true;
        return this.selectIndex < 0;
      })();
      if (isReset) await this.resetPropsAndData();
      else await this.onSelectIndexChange();
    },

    async resetPropsAndData() {
      // console.log(">>>>>>> 重置 input currentItem data_ ---" + this.layer);
      this.shieldWatch();
      await this.$emit("input", "");
      this.currentData = undefined;
      await this.$emit("update:currentItem", this.currentData);
      this.$emit("empty");
      // console.log("");
    },

    async onSelectIndexChange() {
      // console.log("用index设置 currentItem input ---" + this.layer);
      this.shieldWatch();
      this.currentData = this.data_[this.selectIndex];
      let val = this.formatterValue(this.currentData);
      await this.$emit("input", val);
      await this.$emit("update:currentItem", this.currentData);
      this.$emit("selectIndex");
      // console.log("");
    },

    changeCurrentData(value) {
      this.currentData = undefined;
      if (this.data_) {
        this.currentData = this.data_.find(
          (el) => value === this.formatterValue(el)
        );
      }
    },

    async onValueChange(value) {
      // console.log(">>>>>>> onValueChange  ---" + this.layer);
      this.changeCurrentData(value);
      await this.$emit("update:currentItem", this.currentData);
      this.$emit("valueChange");
      // console.log("");
    },

    async setData() {
      if (!this.parent) return;
      console.log(".... setData ****** " + this.layer);
      this.data_ = this.parent.formatterChild(this.parent.currentData);
    },

    async setTreeData() {
      if (this.value) {
        await this.setData();
        await this.onValueChange(this.value);
      } else {
        await this.initCurrentTree();
      }
      if (this.child) await this.child.setTreeData();
    },

    async onTreeMounted() {
      // console.log("当树创建完成");
      this.$emit("treeMounted");
      this.shieldWatch();
      await this.setTreeData();
      this.$emit("treeDataMounted");
    },

    onParentDataSet(){

    },

    handleChain() {
      if (this.selectListTree) {
        this.selectListTree.child = this;
        this.parent = this.selectListTree;
        this.root = this.parent.root;
        this.layer = this.parent.layer + 1;
      } else {
        this.root = this;
        this.parent = null;
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
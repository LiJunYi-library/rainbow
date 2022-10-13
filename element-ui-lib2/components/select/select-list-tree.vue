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
      child: null,
    };
  },
  props: {
    formatterChild: {
      type: Function,
      default: (item) => {
        if (!item) return [];
        if (item instanceof Object) return item.children;
        return item;
      },
    },
    currentItem: [String, Number, Object, Array],
  },
  methods: {
    emitInput(value) {
      this.updateInput(value);
      this.afterUpdateInput(value);
    },

    afterUpdateInput(value) {},

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
      this.child.updateInput("");
    },
  },
  created() {
    if (this.selectListTree) this.selectListTree.child = this;
  },
  beforeDestroy() {
    if (this.selectListTree) this.selectListTree.child = null;
  },
};
</script>
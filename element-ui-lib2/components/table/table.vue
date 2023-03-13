<script>
import { objectFilter } from "@rainbow_ljy/jsapi";
import { renderSlot, renderScopedSlots } from "../../utils";

export default {
  name: "Table",
  provide() {
    return {
      table: this,
    };
  },
  props: {
    showPagination: { type: Boolean, default: true },
    showSelection: Boolean,
    currentPage: { type: Number, default: 1 },
    updateCurrentPage: { type: Function, default: () => {} },
    updatePageSize: { type: Function, default: () => {} },
    pageSize: { type: Number, default: 10 },
    checkList: { type: Array, default: () => [] },
    calcHeight: Number,
    sortProp: String,
    sortOrder: String,
    data: { type: Array, default: () => [] },
    selectAll: { type: Boolean, default: false },
  },
  data() {
    return {
      columnChildren: [],
      winHeight: window.innerHeight,
      defaultSort: { order: this.sortOrder, prop: this.sortProp },
      emitSortChange: true,
      isSelectAll: this.selectAll,
      checkList_: this.checkList,
    };
  },
  computed: {},
  watch: {
    sortProp() {
      if (this.defaultSort.prop === this.sortProp) return;
      if (!this.sortProp) return this.$refs.elTable.clearSort();
      this.defaultSort.prop = this.sortProp;
      this.emitSortChange = false;
      this.$refs.elTable.sort(this.defaultSort.prop, this.defaultSort.order);
      this.emitSortChange = true;
    },
    sortOrder() {
      if (this.defaultSort.order === this.sortOrder) return;
      if (!this.sortOrder) return this.$refs.elTable.clearSort();
      this.defaultSort.order = this.sortOrder;
      this.emitSortChange = false;
      this.$refs.elTable.sort(this.defaultSort.prop, this.defaultSort.order);
      this.emitSortChange = true;
    },
  },
  created() {},
  mounted() {
    // console.log("table", this);
  },
  methods: {
    bindLoading() {
      return false;
    },
    renderTable() {
      let tableAttrs = objectFilter(this.$attrs, /_table/);
      let tableEvent = objectFilter(this.$listeners, /_table/);
      // console.log("tableAttrs", tableAttrs);
      let calcHeight = this.winHeight - this.calcHeight;
      let attrs = {
        border: true,
        defaultSort: this.defaultSort,
        "cell-class-name": (...arg) => this.cell_class_name(...arg),
      };
      if (this.calcHeight) attrs["max-height"] = `${calcHeight || 0}px`;
      return this.$createElement("el-table", {
        ref: "elTable",
        attrs: {
          ...attrs,
          data: this.data,
          ...this.bindTableDefaultAttrs(),
          ...tableAttrs,
        },
        on: {
          select: (...arg) => this.onSelect(...arg),
          "select-all": (...arg) => this.onSelectAll(...arg),
          "selection-change": (...arg) => this.onSelectionChange(...arg),
          "sort-change": (...arg) => this.onSortChange(...arg),
          ...tableEvent,
        },
        props: {},
        scopedSlots: {
          default: (...arg) => this.renderTableDefault(...arg),
          empty: renderScopedSlots.call(this, "empty", this.renderDefaultEmpty),
        },
      });
    },

    renderDefaultEmpty() {
      return null;
    },

    cell_class_name(props) {
      return `el-column-${props.column.property}  el-column-${props.columnIndex}`;
    },

    onSortChange(props) {
      if (!this.emitSortChange) return;
      let { prop, order } = props;
      this.defaultSort.prop = prop;
      this.defaultSort.order = order;
      this.$emit("update:sortProp", this.defaultSort.prop);
      this.$emit("update:sortOrder", this.defaultSort.order);
      this.$emit("sortChange", this.defaultSort.prop, this.defaultSort.order);
      this.emitSortChange = true;
    },

    onSelect(list, ...arg) {
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data.length;
      this.$emit("update:checkList", list);
      this.$emit("select", list, ...arg);
    },

    onSelectAll(list, ...arg) {
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data.length;
      this.$emit("update:checkList", list);
      this.$emit("selectAll", list, ...arg);
    },

    onSelectionChange(list, ...arg) {
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data.length;
      this.$emit("update:checkList", list);
      this.$emit("update:selectAll", this.isSelectAll);
      this.$emit("selection-change", list, this.isSelectAll);
    },

    renderTableDefault(...arg) {
      return [
        this.renderSelection(...arg),
        this.renderSlotsDefault(...arg),
      ].filter(Boolean);
    },

    renderSlotsDefault(...arg) {
      if (this.$slots.default) return this.$slots.default;
      return null;
    },

    renderSelection(...arg) {
      if (!this.showSelection) return null;
      return <el-table-column type="selection" width="55" fixed="left" />;
    },

    bindTableDefaultAttrs() {
      return {};
    },

    //
    renderPagination(...arg) {
      if (!this.showPagination) return null;
      let paginationAttrs = objectFilter(this.$attrs, /_pagination/);
      let paginationEvent = objectFilter(this.$listeners, /_pagination/);
      // console.log("paginationAttrs", paginationAttrs);
      return this.$createElement("el-pagination", {
        attrs: {
          total: 0,
          class: "el-lib-pagination",
          "current-page": this.currentPage,
          "page-size": this.pageSize,
          "page-sizes": [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
          layout: "total, sizes, prev, pager, next, jumper",
          ...this.bindPaginationDefaultAttrs(),
          ...paginationAttrs,
        },
        on: {
          "size-change": this.onSizeChange,
          "current-change": this.onCurrentChange,
          "update:currentPage": (a) => {
            this.$emit("update:currentPage", a);
            this.updateCurrentPage(a);
          },
          "update:pageSize": (a) => {
            this.$emit("update:pageSize", a);
            this.updatePageSize(a);
          },
          ...this.bindPaginationDefaultEvents(),
          ...paginationEvent,
        },
      });
    },
    update(...arg) {
      // console.log("updateupdateupdateupdateupdateupdateupdate", ...arg);
    },

    bindPaginationDefaultAttrs() {
      return {};
    },
    bindPaginationDefaultEvents() {
      return {};
    },
    onSizeChange() {
      this.$emit("pageChange", this.currentPage, this.pageSize);
    },
    onCurrentChange() {
      this.$emit("pageChange", this.currentPage, this.pageSize);
    },
  },
  render() {
    return (
      <div v-loading={this.bindLoading()} class="el-lib-table">
        {this.renderTable()}
        {this.renderPagination()}
      </div>
    );
  },
};
</script>
<style lang="scss">
.el-lib-table {
}
.el-lib-pagination {
  text-align: center;
  padding: 10px 0;
}
</style>


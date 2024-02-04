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
    sticky: { type: Boolean, default: false },
    showPagination: { type: Boolean, default: true },
    showSelection: Boolean,
    currentPage: { type: Number, default: 1 },
    updateCurrentPage: { type: Function, default: () => {} },
    updatePageSize: { type: Function, default: () => {} },
    formatterSelectable: { type: Function, default: () => true },
    pageSize: { type: Number, default: 10 },
    checkList: { type: Array, default: () => [] },
    updateCheckList: { type: Function, default: () => {} },
    calcHeight: Number,
    sortProp: String,
    sortOrder: String,
    orderDescending: { type: String, default: "descending" },
    orderAscending: { type: String, default: "ascending" },
    data: { type: Array, default: () => [] },
    selectAll: { type: Boolean, default: false },
    isRowClickExpansion: Boolean,
    radio: { type: Boolean, default: false },
    isCellClickTOSelect: { type: Boolean, default: false },
  },
  data() {
    return {
      columnChildren: [],
      winHeight: window.innerHeight,
      defaultSort: {
        order: this.transOrder(this.sortOrder),
        prop: this.sortProp,
      },
      emitSortChange: true,
      isSelectAll: this.selectAll,
      checkList_: this.checkList,
      currentPage_: this.currentPage,
      pageSize_: this.pageSize,
      data_: this.data,
      expandList: [],
      tableData: [],
    };
  },
  computed: {},
  watch: {
    data() {
      this.data_ = this.data;
    },
    data_() {
      this.paging();
    },
    pageSize() {
      this.pageSize_ = this.pageSize;
    },
    currentPage() {
      this.currentPage_ = this.currentPage;
    },
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
      let order = this.transOrder(this.defaultSort.order);
      this.$refs.elTable.sort(this.defaultSort.prop, order);
      this.emitSortChange = true;
    },
  },
  created() {},
  mounted() {
    // console.log("table", this);
  },
  methods: {
    addExpand(row, key) {
      this.$refs["elTable"].toggleRowExpansion(row, true);
      if (this.expandList.includes(key)) return;
      this.expandList.push(key);
    },
    removeExpand(row, key) {
      this.$refs["elTable"].toggleRowExpansion(row, false);
      this.expandList = this.expandList.filter((el) => el !== key);
    },
    bindLoading() {
      return false;
    },
    resolverTableData(ARR) {
      if (!this.showPagination) return ARR;
      let e = this.pageSize_ * this.currentPage_;
      let b = (this.currentPage_ - 1) * this.pageSize_;
      let d = (ARR || []).slice(b, e);
      // console.log("b", b);
      // console.log("e", e);
      // console.log("d", d);
      return d;
    },
    renderTable() {
      let tableAttrs = objectFilter(this.$attrs, /_table/);
      let tableEvent = objectFilter(this.$listeners, /_table/);
      // console.log("tableEvent", tableEvent);
      let calcHeight = this.winHeight - this.calcHeight;
      // console.log(this.expandList,tableAttrs);
      let attrs = {
        border: true,
        defaultSort: {
          ...this.defaultSort,
          order: this.transOrder(this.defaultSort.order),
        },
        "row-style": ({ row, rowIndex }) => {
          if (this.rowStyle) return this.rowStyle({ row, rowIndex });
          if (this.sticky)
            return {
              position: "sticky",
              top: 0,
              left: 0,
              "z-index": rowIndex + 4,
            };
          return {};
        },
        "cell-class-name": (...arg) => this.cell_class_name(...arg),
      };
      if (this.calcHeight) attrs["max-height"] = `${calcHeight || 0}px`;
      return this.$createElement("el-table", {
        ref: "elTable",
        attrs: {
          ...attrs,
          data: this.tableData, //this.resolverTableData(this.data_),
          ...this.bindTableDefaultAttrs(),
          ...tableAttrs,
        },
        on: {
          select: (...arg) => this.onSelect(...arg),
          "select-all": (...arg) => this.onSelectAll(...arg),
          "selection-change": (...arg) => this.onSelectionChange(...arg),
          "sort-change": (...arg) => this.onSortChange(...arg),
          ...tableEvent,
          //todo 初始化掌开会有问题
          "cell-click": (...arg) => {
            let [row, column] = [...arg];
            if (this.isRowClickExpansion) {
              if (!row._isExpanded) {
                this.addExpand(row);
                row._isExpanded = true;
              } else {
                this.removeExpand(row);
                row._isExpanded = false;
              }
              // console.log(...arg);
            }
            this.cellClickTOSelect(...arg);
            this.$emit("row-click", ...arg);
          },
        },
        props: {},
        scopedSlots: {
          default: (...arg) => this.renderTableDefault(...arg),
          empty: renderScopedSlots.call(this, "empty", this.renderDefaultEmpty),
        },
      });
    },

    cellClickTOSelect(item) {
      if (!this.isCellClickTOSelect) return;
      if (!this.formatterSelectable(item)) return;
      if (!this.radio) this.$refs.elTable.toggleRowSelection(item);
      this.onRadioClick(item);
    },
    onRadioClick(item) {
      if (!this.radio) return;
      if (!this.formatterSelectable(item)) return;
      let list = [item];
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data_.length;
      this.$emit("update:checkList", list);
      this.updateCheckList(list);
      this.$emit("select", list, item);
    },

    renderDefaultEmpty() {
      return null;
    },

    cell_class_name(props) {
      return `el-column-${props.column.property}  el-column-${props.columnIndex}`;
    },

    parseOrder(order) {
      if (order === "descending") order = this.orderDescending;
      if (order === "ascending") order = this.orderAscending;
      return order;
    },

    transOrder(order) {
      if (order === this.orderDescending) order = "descending";
      if (order === this.orderAscending) order = "ascending";
      return order;
    },

    onSortChange(props) {
      if (!this.emitSortChange) return;
      let { prop, order } = props;
      order = this.parseOrder(order);
      this.defaultSort.prop = prop;
      this.defaultSort.order = order;
      this.$emit("update:sortProp", this.defaultSort.prop);
      this.$emit("update:sortOrder", this.defaultSort.order);
      this.$emit("sortChange", this.defaultSort.prop, this.defaultSort.order);
      this.emitSortChange = true;
    },

    onSelect(list, item) {
      if (this.radio) return;
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data_.length;
      this.$emit("update:checkList", list);
      this.updateCheckList(list);
      this.$emit("select", list, item);
    },

    onSelectAll(list, ...arg) {
      if (this.radio) return;
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data_.length;
      this.$emit("update:checkList", list);
      this.updateCheckList(list);
      this.$emit("selectAll", list, ...arg);
    },

    onSelectionChange(list, ...arg) {
      if (this.radio) return;
      this.checkList_ = list;
      this.isSelectAll = list.length === this.data_.length;
      this.$emit("update:checkList", list);
      this.updateCheckList(list);
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
      if (this.radio)
        return (
          <el-table-column
            selectable={this.formatterSelectable}
            label-class-name="table-column-radio"
            width="55"
            fixed="left"
          >
            {({ row }) => (
              <div
                class={[
                  "table-column-radio-con",

                  this.checkList_.some((el) => el === row) &&
                    "table-column-radio-con-act",
                ]}
                onClick={this.onRadioClick}
              ></div>
            )}
          </el-table-column>
        );
      return (
        <el-table-column
          type="selection"
          selectable={this.formatterSelectable}
          width="55"
          fixed="left"
        />
      );
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
          total: this.data_.length,
          class: "el-lib-pagination",
          "current-page": this.currentPage_,
          "page-size": this.pageSize_,
          "page-sizes": [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
          layout: "total, sizes, prev, pager, next, jumper",
          ...this.bindPaginationDefaultAttrs(),
          ...paginationAttrs,
        },
        on: {
          "size-change": this.onSizeChange,
          "current-change": this.onCurrentChange,
          "update:currentPage": (a) => {
            this.currentPage_ = a;
            this.$emit("update:currentPage", a);
            this.updateCurrentPage(a);
          },
          "update:pageSize": (a) => {
            this.pageSize_ = a;
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
      this.$emit("pageChange", this.currentPage_, this.pageSize_);
      this.paging();
    },
    onCurrentChange() {
      this.$emit("pageChange", this.currentPage_, this.pageSize_);
      this.paging();
    },
    paging() {
      if (!this.showPagination) {
        this.tableData = this.data_;
        return;
      }
      let e = this.pageSize_ * this.currentPage_;
      let b = (this.currentPage_ - 1) * this.pageSize_;
      this.tableData = (this.data_ || []).slice(b, e);
    },
  },
  render() {
    return (
      <div v-loading={this.bindLoading()} class="el-lib-table">
        {this.renderTable()}
        {this.renderPagination()}

        <div class="el-lib-table-absolute">{this._t("absolute")}</div>
      </div>
    );
  },
};
</script>
<style lang="scss">
.el-lib-table {
  position: relative;
}

.el-lib-table-absolute {
  position: absolute;
  right: 0;
  bottom: 5px;
  z-index: 5;
}

.el-lib-pagination {
  text-align: center;
  padding: 10px 0;
}
.table-column-radio {
  visibility: hidden;
}
.table-column-radio-con {
  box-sizing: border-box;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid gray;
  background: white;
}
.table-column-radio-con-act {
  background: #409eff;
  color: #409eff;
}
</style>

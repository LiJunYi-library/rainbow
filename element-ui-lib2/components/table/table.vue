<script>
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  name: "Table",
  props: {
    showPagination: { type: Boolean, default: true },
    showSelection: Boolean,
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 10 },
    checkList: { type: Array, default: () => [] },
    calcHeight: Number,
    sortProp: String,
    sortOrder: String,
  },
  data() {
    return {
      winHeight: window.innerHeight,
      defaultSort: { order: this.sortOrder, prop: this.sortProp },
    };
  },
  computed: {},
  watch: {
    sortProp() {
      if (this.defaultSort.prop === this.sortProp) return;
      this.defaultSort.prop = this.sortProp;
      this.$refs.elTable.sort(this.defaultSort.prop, this.defaultSort.order);
    },
    sortOrder() {
      if (this.defaultSort.order === this.sortOrder) return;
      this.defaultSort.order = this.sortOrder;
      this.$refs.elTable.sort(this.defaultSort.prop, this.defaultSort.order);
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
      return this.$createElement("el-table", {
        ref: "elTable",
        attrs: {
          border: true,
          "max-height": calcHeight || "",
          defaultSort: this.defaultSort,
          ...this.bindTableDefaultAttrs(),
          ...tableAttrs,
        },
        on: {
          select: (...arg) => this.onSelect(...arg),
          "select-all": (...arg) => this.onSelectAll(...arg),
          "sort-change": (...arg) => this.onSortChange(...arg),
          ...tableEvent,
        },
        props: {},
        scopedSlots: {
          default: (...arg) => this.renderTableDefault(...arg),
        },
      });
    },

    onSortChange(props) {
      let { prop, order } = props;
      this.defaultSort.prop = prop;
      this.defaultSort.order = order;
      this.$emit("update:sortProp", this.defaultSort.prop);
      this.$emit("update:sortOrder", this.defaultSort.order);
      this.$emit("sortChange", this.defaultSort.prop, this.defaultSort.order);
    },

    onSelect(list, ...arg) {
      this.$emit("update:checkList", list);
      this.$emit("select", list, ...arg);
    },

    onSelectAll(list, ...arg) {
      this.$emit("update:checkList", list);
      this.$emit("selectAll", list, ...arg);
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
          layout: "total, sizes, prev, pager, next, jumper",
          ...this.bindPaginationDefaultAttrs(),
          ...paginationAttrs,
        },
        on: {
          "size-change": this.onSizeChange,
          "current-change": this.onCurrentChange,
          "update:currentPage": (a) => this.$emit("update:currentPage", a),
          "update:pageSize": (a) => this.$emit("update:pageSize", a),
          ...this.bindPaginationDefaultEvents(),
          ...paginationEvent,
        },
      });
    },
    update(...arg) {
      console.log("updateupdateupdateupdateupdateupdateupdate", ...arg);
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


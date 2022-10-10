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
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
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
      return this.$createElement("el-table", {
        attrs: {
          border: true,
          ...this.bindTableDefaultAttrs(),
          ...tableAttrs,
        },
        on: {
          select: (...arg) => this.onSelect(...arg),
          "select-all": (...arg) => this.onSelectAll(...arg),
          ...tableEvent,
        },
        props: {},
        scopedSlots: {
          default: (...arg) => this.renderTableDefault(...arg),
        },
      });
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
      return <el-table-column type="selection" width="55" />;
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
          total: 500,
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
      <div v-loading={this.bindLoading()}>
        {this.renderTable()}
        {this.renderPagination()}
      </div>
    );
  },
};
</script>
<style lang="scss">
.mmb-table {
  display: flex;
  flex-direction: column;
  margin: 0;
  .mmb-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    height: 62px;
    background: white;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }
  .mmb-table-content {
    background: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
  }
  .el-table__header-wrapper {
    border: 1px solid #dddddd;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
    box-sizing: border-box;
  }
  .el-table__header {
    colgroup {
      display: table-column-group;
      background: #eeeeee;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      border-color: #dddddd;
      border-bottom: none;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
  .el-table th,
  .el-table tr {
    background-color: #ffffff00;
  }
}
</style>

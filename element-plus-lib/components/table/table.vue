<script>
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";
import { QueuePromise } from "@rainbow_ljy/jsapi";

export default {
  emits: [
    "update:checkList",
    "update:currentPage",
    "update:pageSize",
    "update:sortProp",
    "update:sortOrder",
    "update:elTable",
    "select",
    "selectAll",
    "pageChange",
    "sortChange",
  ],
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
    showSelection: Boolean,
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 10 },
    sortProp: String,
    sortOrder: String,
    elTable: Object,
  },
  data() {
    return {
      check_list: this.checkList,
      mergePageEvent: new QueuePromise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 0);
      }),
      currentPage_: this.currentPage,
      pageSize_: this.pageSize,
      defaultSort: { order: this.sortOrder, prop: this.sortProp },
    };
  },
  watch: {
    checkList() {
      this.check_list = this.checkList;
    },
    currentPage() {
      this.currentPage_ = this.currentPage;
    },
    pageSize() {
      this.pageSize_ = this.pageSize;
    },
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
    this.$emit("update:elTable", this.$refs.elTable);
  },
  render(_ctx, _cache, $props, $setup, $data, $options) {
    return (
      <div class="el-lib-table" v-loading={this.bindLoading()}>
        {this.renderTable()}
        {this.renderPagination()}
      </div>
    );
  },
  methods: {
    bindLoading() {
      return false;
    },

    renderPagination() {
      let paginationAttrs = objectFilter(this.$attrs, /_P/g);
      const el_pagination = resolveComponent("el-pagination");
      return (
        <el-pagination
          class="el-lib-pagination"
          page-sizes={[10, 20, 30, 40, 50, 100]}
          layout={"total,sizes, prev, pager, next, jumper"}
          total={0}
          currentPage={this.currentPage_}
          pageSize={this.pageSize_}
          onUpdate:currentPage={(page) => (this.currentPage_ = page)}
          onUpdate:pageSize={(size) => (this.pageSize_ = size)}
          onSizeChange={(...arg) => this.onSizeChange(...arg)}
          onCurrentChange={(...arg) => this.onCurrentChange(...arg)}
          {...this.bindPaginationDefaultAttrs()}
          {...paginationAttrs}
        />
      );
    },

    handlePageEvent() {
      this.$emit("update:currentPage", this.currentPage_);
      this.$emit("update:pageSize", this.pageSize_);
      this.$emit("pageChange", this.currentPage_, this.pageSize_);
    },

    async onSizeChange(...arg) {
      await this.mergePageEvent;
      this.handlePageEvent();
    },

    async onCurrentChange(...arg) {
      await this.mergePageEvent;
      this.handlePageEvent();
    },

    bindPaginationDefaultAttrs() {
      return {};
    },

    renderSlotsDefault(...arg) {
      if (!this.$slots.default) return null;
      return this.$slots.default(...arg);
    },

    renderSelection(...arg) {
      if (!this.showSelection) return null;
      const el_table_column = resolveComponent("el-table-column");
      return <el-table-column type="selection" width="55" />;
    },

    renderDefault(...arg) {
      return [
        this.renderSelection(...arg),
        this.renderSlotsDefault(...arg),
      ].filter(Boolean);
    },

    renderEmpty(...arg) {
      if (this.$slots.empty) return this.$slots.empty(...arg);
      return this.renderDefaultEmpty(...arg);
    },

    renderDefaultEmpty(...arg) {
      return [<div class="empty">暂无数据</div>];
    },

    renderTable() {
      let attrs = objectFilter(this.$attrs, /_T/g);
      const el_table = resolveComponent("el-table");
      return h(
        el_table,
        {
          ref: "elTable",
          border: true,
          onSelect: (...arg) => this.onSelect(...arg),
          onSelectAll: (...arg) => this.onSelectAll(...arg),
          defaultSort: this.defaultSort,
          onSortChange: (...arg) => this.onSortChange(...arg),
          ...this.bindTableDefaultAttrs(),
          ...attrs,
        },
        {
          default: (...arg) => this.renderDefault(...arg),
          empty: (...arg) => this.renderEmpty(...arg),
        }
      );
    },

    bindTableDefaultAttrs() {
      return {};
    },

    onSortChange(props) {
      let { column, prop, order } = props;
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
  },
};
</script>
<style>
.el-lib-table {
  --el-table-header-bg-color: red;
}

.el-lib-table .empty {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-lib-table .fetchError {
  color: red;
}

.el-lib-table .el-table th.el-table__cell {
  background-color: rgb(230, 230, 230);
}

.el-lib-table .el-lib-pagination {
  justify-content: center;
  background: white;
  padding: 10px 0;
}
</style>

<script>
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  emits: ["update:checkList", "select", "selectAll"],
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
    showSelection: Boolean,
  },
  data() {
    return {
      check_list: this.checkList,
    };
  },
  watch: {
    checkList() {
      this.check_list = this.checkList;
    },
  },
  created() {},
  mounted() {},
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
          page-sizes={[10, 20, 30, 40]}
          layout={"total, sizes, prev, pager, next, jumper"}
          total={0}
          {...this.bindPaginationDefaultAttrs()}
          {...paginationAttrs}
        />
      );
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
      if (this.$slots.empty) return this.$slots.empty();
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
          border: true,
          onSelect: (...arg) => this.onSelect(...arg),
          onSelectAll: (...arg) => this.onSelectAll(...arg),
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

.el-lib-table .el-table th.el-table__cell {
  background-color: rgb(230, 230, 230);
}

.el-lib-table .el-lib-pagination {
  justify-content: center;
  background: white;
  padding: 10px 0;
}
</style>

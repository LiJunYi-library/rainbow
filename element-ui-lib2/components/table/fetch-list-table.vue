<script>
import Table from "./table.vue";
import fetchOptions from "../../mixins/fetchOptions";
import { renderSlot, renderScopedSlots } from "../../utils";

export default {
  extends: Table,
  mixins: [fetchOptions],
  props: {
    setList: {
      type: Function,
      default(res) {
        if (!res) return [];
        if (res instanceof Array) return res;
        if (res.list) return res.list;
        return [];
      },
    },
  },
  methods: {
    bindLoading() {
      return this.loading_;
    },
    bindPaginationDefaultAttrs() {
      let arr = this.setList(this.responseData_) || [];
      let total = arr.length;
      return { total };
    },

    afterFetch() {
      this.data_ = this.setList(this.responseData_) || [];
      this.$refs.elTable.doLayout();
      this.$emit("update:checkList", []);
    },

    renderDefaultEmpty(...arg) {
      if (this.isFetchError)
        return renderSlot.call(this, "error", null, this.renderDefaultError);
      return this.renderEmpty(...arg);
    },

    renderEmpty(...arg) {
      return [<div class="empty">暂无数据</div>];
    },

    renderDefaultError(...arg) {
      return (
        <div class="fetchError">
          <el-button
            type={"danger"}
            link={true}
            onclick={() => this.onErrorClick(...arg)}
          >
            {this.errorText}
          </el-button>
        </div>
      );
    },

    onErrorClick(...arg) {
      if (this.$listeners.onErrorClick) {
        this.$listeners.onErrorClick();
        return;
      }
      this.callFetchData();
    },
  },
};
</script>
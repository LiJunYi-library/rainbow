<script>
import Table from "./table.vue";
import fetchOptions from "../../mixins/fetchOptions";

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
    setTotal: {
      type: Function,
      default(res) {
        if (!res) return 0;
        if (res.total) return res.total;
        if (res.length) return res.length;
        return 0;
      },
    },
  },
  methods: {
    bindLoading() {
      return this.loading_;
    },
    bindPaginationDefaultAttrs() {
      let total = this.setTotal(this.responseData_) || 0;
      return { total };
    },
    bindTableDefaultAttrs() {
      let vm = this;
      return {
        data: vm.setList(vm.responseData_) || [],
      };
    },

    afterFetch() {
      this.$refs.elTable.doLayout();
    },

    // renderDefaultEmpty(...arg) {
    //   if (this.isFetchError) return this.renderDefaultError(...arg);
    //   return [<div class="empty">暂无数据</div>];
    // },

    // renderDefaultError(...arg) {
    //   if (this.$slots.error) return this.$slots.error;
    //   return (
    //     <el-button
    //       type={"danger"}
    //       link={true}
    //       onclick={() => this.onErrorClick(...arg)}
    //     >
    //       {this.errorText}
    //     </el-button>
    //   );
    // },

    // onErrorClick(...arg) {
    //   this.$attrs.onErrorClick;
    //   if (this.$attrs.onErrorClick) {
    //     this.$attrs.onErrorClick();
    //     return;
    //   }
    //   this.callFetchData();
    // },

    //
  },
};
</script>
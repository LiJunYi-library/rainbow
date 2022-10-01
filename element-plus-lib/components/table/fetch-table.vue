<script>
import Table from "./table.vue";
import fetchOptions from "../../mixins/fetchOptions.js";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";
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
  data() {
    return {};
  },

  watch: {
    responseData_(VAL) {},
  },

  methods: {
    bindLoading() {
      return this.loading_;
    },

    beforeFetch() {},

    errorFetch(data, errorText) {},

    renderDefaultEmpty(...arg) {
      if (this.isFetchError) return this.renderDefaultError(...arg);
      return [<div class="empty">暂无数据</div>];
    },

    renderDefaultError(...arg) {
      if (this.$slots.error) return this.$slots.error(...arg);
      const el_button = resolveComponent("el-button");
      return (
        <el_button
          type={"danger"}
          link={true}
          onclick={() => this.onErrorClick(...arg)}
        >
          {this.errorText}
        </el_button>
      );
    },

    onErrorClick(...arg) {
      this.$attrs.onErrorClick;
      if (this.$attrs.onErrorClick) {
        this.$attrs.onErrorClick();
        return;
      }
      if (this.fetchData instanceof Array) {
        this.fetchData.forEach((fun) => {
          fun();
        });
      }

      if (this.fetchData instanceof Function) {
        this.fetchData();
      }
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
  },
};
</script>
<style>
</style>
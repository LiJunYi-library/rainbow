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

  watch: {
    responseData_(VAL) {},
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
  },
};
</script>
<style>
</style>
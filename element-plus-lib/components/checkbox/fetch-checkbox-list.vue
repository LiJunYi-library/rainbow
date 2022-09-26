<script>
import checkboxList from "./checkbox-list.vue";
import fetchOptions from "../../mixins/fetchOptions.js";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";
export default {
  extends: checkboxList,
  mixins: [fetchOptions],
  watch: {
    responseData_(val) {
      this.arrayList = val;
      this.handleCheckAllChange(this.checkAll);
    },
  },
};
</script>
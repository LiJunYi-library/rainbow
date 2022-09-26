<script>
import tableColumn from "./table-column.vue";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  extends: tableColumn,
  props: {
    buttonText: String,
  },
  methods: {
    renderDefaultDefault(...arg) {
      const el_button = resolveComponent("el-button");
      let buttonAttrs = objectFilter(this.$attrs, /_button/g);
      let str = this.buttonText || this.getValue(...arg);
      return <el_button {...buttonAttrs}> {str} </el_button>;
    },
  },
};
</script>

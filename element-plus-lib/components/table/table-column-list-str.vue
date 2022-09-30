<script>
import tableColumn from "@rainbow_ljy/element-plus-lib/components/table/table-column.vue";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  extends: tableColumn,
  props: {
    formatterItem: {
      type: Function,
      default: (item) => {
        return item;
      },
    },
  },
  methods: {
    renderDefaultDefault(...arg) {
      let val = this.getValue(...arg) || [];
      if (!(val instanceof Array)) return null;
      return (
        <span class="table-column-list-str">
          {val.map((el) => (
            <div> {this.formatterItem(el)} </div>
          ))}
        </span>
      );
    },
  },
};
</script>
<style>
.table-column-list-str {
  display: inline-block;
  text-align: left;
}
</style>

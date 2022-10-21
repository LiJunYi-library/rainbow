


<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  extends: tableColumn,
  props: {
    fixed: { type: Number, default: 0 },
  },
  methods: {
    bindDefaultAttrs() {
      return {
        formatter: (row, column, val, $index) => (val * 1).toFixed(this.fixed),
      };
    },
  },
};
</script>



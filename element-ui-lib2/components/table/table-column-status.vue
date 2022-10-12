<script>
import tableColumn from "./table-column.vue";
export default {
  extends: tableColumn,
  props: {
    status: { type: Array, default: [] },
  },
  methods: {
    bindDefaultAttrs() {
      return {
        formatter: (row) => {
          let index = row[this.$attrs.prop] * 1;
          if (typeof index === "number") return this.status[index];
          return undefined;
        },
      };
    },
  },
};
</script> 
<script>
import tableColumn from "./table-column.vue";
export default {
  extends: tableColumn,
  props: {
    label: { type: String, default: "操作" },
  },
  methods: {
    bindDefaultAttrs() {
      return {
        width: "100",
        fixed: "right",
      };
    },
  },
};
</script> 
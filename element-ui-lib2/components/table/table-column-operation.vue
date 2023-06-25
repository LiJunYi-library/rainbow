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
        'class-name':"el-table-column-operation",
        width: "100",
        fixed: "right",
      };
    },
  },
};
</script> 
<style>
  .el-table-column-operation  .cell{
      visibility: unset;
  }

</style>
<script>
import tableColumn from "./table-column.vue";
export default {
  extends: tableColumn,
  methods: {
    renderDefaultSlot() {
      return (props) => {
        let list = this.getValue(props);

        if (!(list instanceof Array)) {
          // console.error("prop 不是一个数组");
          return this.emptyText;
        }

        let nodes = [];

        if (this.$scopedSlots.default) {
          list.forEach((item, index) => {
            nodes.push(this.$scopedSlots.default({ item, ...props }));
          });
        } else {
          nodes = list.map((item, index) => (
           <div> <div class="table-column-lib"> {item} </div></div>
          ));
        }

        if (!nodes.length) return this.emptyText;
        return nodes;
      };
    },
    bindDefaultAttrs() {
      return {
        "class-name": "table-column-list",
      };
    },
  },
};
</script> 
<style>
.el-table  .table-column-list .cell{
  max-height: 100px;
  overflow: auto;
}
</style>
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
        list.forEach((item, index) => {
          nodes.push(this.$scopedSlots.default({ item, ...props }));
        });

        if (!nodes.length) return this.emptyText;
        return nodes;
      };
    },
  },
};
</script> 
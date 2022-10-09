<script>
// import tableColumn from "./table-column.vue";
// export default {
//   extends: tableColumn,
//   methods: {
//     renderDefault(h) {
//       return (props) => {
//         let list = props.row[this.prop] || [];
//         if (!(list instanceof Array)) {
//           console.error("prop 不是一个数组");
//           return;
//         }
//         let nodes = [];
//         list.forEach((element, index) => {
//           nodes.push(this.$scopedSlots.default(element));
//         });
//         if (!nodes.length) return this.emptyText;
//         return nodes;
//       };
//     },
//   },
// };
</script>
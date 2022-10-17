


<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  extends: tableColumn,
  props: {
    linkProp: String,
    buttonText: String,
  },
  data() {
    return {
      data_table_: [],
    };
  },
  methods: {
    renderDefaultSlot() {
      return (props) => {
        let LIST = this.getValue(props);
        let ATTRS = objectFilter(this.$attrs, /_table/g);
        this.data_table_ = LIST;
        let EVENTS = objectFilter(this.$listeners, /_table/g);
        props.column.columnName = "el-table-column-table";
        props.columnName = "el-table-column-table";
        return this.$createElement("el-table", {
          ref: "el-table-column-table",
          attrs: {
            class: "el-table-column-table",
            "show-header": false,
            data: LIST,
            "max-height": 200,
            columnName: "el-table-column-table",
            ...ATTRS,
          },
          on: {
            ...EVENTS,
          },
          scopedSlots: {
            default: (group) => {
              // group.parent = props;
              // console.log(";;;;;;;;;;;;;;;;;", group);
              return this.renderTableDefault(props);
            },
            empty: () => this.renderTableEmpty(props),
          },
        });
      };
    },

    renderTableDefault(props) {
      // console.log(">>>>>>>>>>>", this);
      // console.log(">>>>>>>>>>>", this.columnChildren);
      if (this.$slots.default) return this.$slots.default;
      if (this.$scopedSlots.default) return this.$scopedSlots.default(props);
      return null;
    },

    renderTableEmpty(props) {
      //  console.log(">>>>>>>>>>>", this);
      // console.log(">>>>>>>>>>>", this.columnChildren);
      if (this.$slots.empty) return this.$slots.empty;
      if (this.$scopedSlots.empty) return this.$scopedSlots.empty(props);
      return null;
    },

    mounted() {
      // console.log(">>>>>>>>>>>", this.$refs);
    },
  },
};
</script>
<style>
.el-table-column-table {
  padding: 0;
}
</style>



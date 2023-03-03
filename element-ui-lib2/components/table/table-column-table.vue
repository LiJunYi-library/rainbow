


<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  extends: tableColumn,
  props: {
    linkProp: String,
    buttonText: String,
    maxHeight: Number,
    lables: { type: Array, default: [] },
  },
  data() {
    return {
      data_table_: [],
    };
  },
  methods: {
    bindDefaultAttrs() {
      return {
        "class-name": "el-table-column-list",
      };
    },
    renderHeader(props) {
      return (
        <div class="el-table-column-list-header">
          {this.lables.map((el, index) => {
            return (
              <div
                class={`${index ? "lable" : ""}`}
                style={`width:${el.width}px;`}
              >
                {el.text}
              </div>
            );
          })}
        </div>
      );
    },
    renderDefaultSlot() {
      return (props) => {
        let LIST = this.getValue(props) || [];
        let ATTRS = objectFilter(this.$attrs, /_table/g);
        this.data_table_ = LIST;
        let EVENTS = objectFilter(this.$listeners, /_table/g);
        props.column.columnName = "el-table-column-table";
        props.columnName = "el-table-column-table";
        // console.log(";;;;;;;;;;;LIST;;;;;;", LIST);
        return this.$createElement("el-table", {
          ref: "el-table-column-table",
          attrs: {
            class: "el-table-column-table",
            "show-header": false,
            data: LIST,
            "max-height": this.maxHeight || 200,
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
      console.log(">>>>>>>>>>>", this.$refs);
    },
  },
};
</script>
<style>
.el-table .el-table__cell.el-table-column-list {
  padding: 0;
}

.el-table .el-table__cell.el-table-column-list .cell {
  padding: 0;
}
.el-table__header .el-table-column-list {
}
.el-table .el-table__header-wrapper .el-table-column-list .cell {
  height: 100%;
  display: block;
  position: unset;
}
.el-table-column-table {
  padding: 0;
}
.el-table-column-list-header {
  height: 100%;
  display: flex;
  align-items: stretch;
}
.el-table-column-list-header .lable {
  box-sizing: border-box;
  border-left: 1px solid #00000020;
}
</style>



<script>
import { objectFilter } from "@rainbow_ljy/jsapi";
import { renderSlot, renderScopedSlots } from "../../utils";

export default {
  provide() {
    return {
      tableColumn: this,
    };
  },
  inject: {
    table: { default: null },
    tableColumn: { default: null },
  },
  props: {
    prop: String,
    label: String,
    showOverflowTooltip: Boolean,
  },
  data() {
    return {
      columnChildren: [],
    };
  },
  created() {
    this.addChain("table");
    this.addChain("tableColumn");
  },
  beforeDestroy() {
    this.removeChain("table");
    this.removeChain("tableColumn");
  },
  methods: {
    addChain(key) {
      let parent = this[key];
      if (!parent) return;
      if (!parent.columnChildren) return;
      if (parent.columnChildren.includes(this)) return;
      parent.columnChildren.push(this);
    },
    removeChain(key) {
      let parent = this[key];
      if (!parent) return;
      if (!parent.columnChildren) return;
      let index = parent.columnChildren.findIndex((el) => el === this);
      if (index === -1) return;
      parent.columnChildren.splice(index, 1);
    },
    handleSolt(name) {
      if (this.$slot[name]) return this.$slot[name];
      if (this.$scopedSlots[name]) {
        return (props) => {
          return this.$scopedSlots[name]({ ...props });
        };
      }
    },
    bindDefaultAttrs() {
      return {};
    },

    getValue(group) {
      let { row, column, $index } = group;
      let val = row[this.$props.prop];
      if (column.formatter) val = column.formatter(row, column, val, $index);
      return val;
    },

    renderDefaultSlot() {
      if (this.$scopedSlots.default) {
        return (props) => {
          return this.$scopedSlots.default(props);
        };
      }
      return (props) => [
        renderSlot.call(this, "start", props, this.renderStart),
        this.renderDefault(props),
        renderSlot.call(this, "end", props, this.renderEnd),
      ];
    },

    renderStart(props) {
      return null;
    },

    renderEnd(props) {
      return null;
    },

    renderDefault(props) {
      let val = this.getValue(props);
      if (this.showOverflowTooltip) return val;
      return <div class="table-column-lib">{val}</div>;
    },

    renderHeaderSlot() {
      if (this.$scopedSlots.header) {
        return (props) => {
          return this.$scopedSlots.header(props);
        };
      }
      return (props) => this.renderHeader(props);
    },

    renderHeader(props) {
      return [<span>{this.label}</span>, this.renderTooltip()].filter(Boolean);
    },

    renderTooltip() {
      let tooltipAttrs = objectFilter(this.$attrs, /_tooltip/) || {};
      if (!tooltipAttrs.content) return null;
      return this.$createElement(
        "el-tooltip",
        {
          attrs: {
            effect: "dark",
            "raw-content": true,
            content: tooltipAttrs.content,
            placement: "top",
          },
        },
        [<i class="el-icon-question mL5"></i>]
      );
    },
  },
  render() {
    return this.$createElement("el-table-column", {
      attrs: {
        align: "center",
        showOverflowTooltip: this.showOverflowTooltip,
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
        prop: this.prop,
      },
      scopedSlots: {
        default: this.renderDefaultSlot(),
        header: this.renderHeaderSlot(),
      },
    });
  },
};
</script>
<style>
.table-column-lib {
  display: inline-block;
  text-align: left;
}
.table-column-header {
  display: inline-block;
}
</style>

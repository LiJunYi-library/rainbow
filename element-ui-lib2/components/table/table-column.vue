<script>
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  provide() {
    return {
      tableColumn: this,
    };
  },
  props: {
    label: String,
  },
  data() {
    return {};
  },
  methods: {
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
      let val = row[this.$attrs.prop];
      if (column.formatter) val = column.formatter(row, column, val, $index);
      return val;
    },

    renderDefaultSlot() {
      if (this.$scopedSlots.default) {
        return (props) => {
          return this.$scopedSlots.default(props);
        };
      }
      return (props) => this.renderDefault(props);
    },

    renderDefault(props) {
      let val = this.getValue(props);
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
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
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

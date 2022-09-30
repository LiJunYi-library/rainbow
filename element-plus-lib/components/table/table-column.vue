<script>
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  props: {
    toFixed: { type: Number },
  },
  render(_ctx, _cache, $props, $setup, $data, $options) {
    const el_table_column = resolveComponent("el-table-column");
    let attrs = this.$attrs;
    return h(
      el_table_column,
      {
        ...this.bindFormatter(),
        align: "center",
        ...this.bindDefaultProps(),
        ...attrs,
      },
      {
        default: (...arg) => this.renderDefault(...arg),
        header: (...arg) => this.renderHeader(...arg),
      }
    );
  },
  methods: {
    getValue(scope) {
      let attrs = this.$attrs;
      let { row, column, $index } = scope;
      let val = row[attrs.prop];
      if (column.formatter)
        val = column.formatter(row, column, row[attrs.prop], $index);
      return val;
    },

    bindFormatter() {
      let vm = this;
      return {
        formatter(row, column, cellValue, index) {
          let str = cellValue * 1;
          if (vm.toFixed && str) {
            return str.toFixed(vm.toFixed);
          }
          return cellValue;
        },
      };
    },

    bindDefaultProps() {
      return {
        align: "center",
      };
    },

    renderDefault(...arg) {
      if (this.$slots.default) return this.$slots.default(...arg);
      return this.renderDefaultDefault(...arg);
    },

    renderDefaultDefault(...arg) {
      let val = this.getValue(...arg);
      return <div class="table-column-lib">{val}</div>;
    },

    renderHeader(...arg) {
      if (this.$slots.header) return this.$slots.header(...arg);
      return this.renderDefaultHeader(...arg);
    },

    renderDefaultHeader(...arg) {
      const el_tooltip = resolveComponent("el-tooltip");
      const attrs = this.$attrs;
      let tooltipAttrs = objectFilter(this.$attrs, /_tooltip/g);
      const { content_tooltip } = this.$attrs;
      if (!content_tooltip) return <span>{attrs.label}</span>;
      return [
        <span>{attrs.label}</span>,
        h(
          el_tooltip,
          {
            effect: "dark",
            placement: "top",
            ...tooltipAttrs,
          },
          {
            default: (...arg) => (
              <i style="padding-left: 5px" class="el-icon-question" />
            ),
          }
        ),
      ];
    },
  },
};
</script>

<style>
.table-column-lib {
  text-align: left;
  display: inline-block;
}
</style>

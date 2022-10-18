


<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  extends: tableColumn,
  props: {
    linkProp: [String, Boolean],
    buttonText: String,
  },
  methods: {
    renderDefaultSlot() {
      return (props) => {
        let str = this.getValue(props);
        let tooltipAttrs = objectFilter(this.$attrs, /_tooltip/g);
        let attrs = { placement: "top", ...tooltipAttrs };
        return this.$createElement(
          "el-tooltip",
          {
            attrs,
          },
          [
            this.rendertextOrButton(props, str),
            <template slot="content">
              {this.renderTooltipContentSlot(props)}
            </template>,
          ]
        );
      };
    },

    rendertextOrButton(props, str) {
      if (!this.linkProp) return <div class="table-column-lib">{str}</div>;
      return this.renderButton(props);
    },

    onClick(scope) {
      if (this.$listeners.click) {
        this.$listeners.click(scope);
        return;
      }
      if (!this.linkProp) return;
      let { row, column, $index } = scope;
      let url = row[this.linkProp] || this.getValue(scope);
      if (!url) return;
      window.open(url);
    },

    renderButton(props) {
      let style = {
        "white-space": "pre-wrap",
        "text-align": "left",
        "line-height": "18px",
      };
      let buttonAttrs = objectFilter(this.$attrs, /_button/g);
      let buttonEvent = this.$listeners;
      let str = this.buttonText || this.getValue(props);
      return this.$createElement(
        "el-button",
        {
          style,
          attrs: {
            type: "text",
            ...buttonAttrs,
          },
          on: {
            click: () => this.onClick(props),
          },
        },
        str
      );
    },

    renderTooltipContentSlot(props) {
      if (this.$slots.default) return this.$slots.default;
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default(props);
      }
      return null;
    },
  },
};
</script>



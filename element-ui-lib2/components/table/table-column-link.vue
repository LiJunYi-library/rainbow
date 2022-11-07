


<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";

export default {
  extends: tableColumn,
  props: {
    linkProp: String,
    buttonText: String,
  },
  methods: {
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

    renderDefault(props) {
      return this.renderButton(props);
    },

    renderButton(props) {
      let style = {
        "white-space": "pre-wrap",
        "text-align": "left",
        "line-height": "18px",
      };
      let buttonAttrs = objectFilter(this.$attrs, /_link/g);
      let buttonEvent = this.$listeners;
      let str = this.buttonText || this.getValue(props);
      return this.$createElement(
        "el-link",
        {
          style,
          attrs: {
            type: "primary",
            ...buttonAttrs,
          },
          on: {
            click: () => this.onClick(props),
          },
        },
        str
      );
    },
  },
};
</script>



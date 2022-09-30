<script>
import tableColumn from "./table-column.vue";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  extends: tableColumn,
  props: {
    buttonText: String,
    linkProp: String,
  },
  methods: {
    renderDefaultDefault(...arg) {
      const el_button = resolveComponent("el-button");
      let buttonAttrs = objectFilter(this.$attrs, /_button/g);
      let str = this.buttonText || this.getValue(...arg);
      let style = {
        "white-space": "pre-wrap",
        "text-align": "left",
        "line-height": "18px",
      };
      return (
        <el_button
          type={"primary"}
          link={true}
          style={style}
          onclick={() => this.onClick(...arg)}
          {...buttonAttrs}
        >
          {str}
        </el_button>
      );
    },
    onClick(scope) {
      if (!this.linkProp) return;
      let { row, column, $index } = scope;
      let url = row[this.linkProp];
      if (!url) return;
      window.open(url);
    },
  },
};
</script>
<style>
.table-column-but {
  white-space: pre-wrap;
  text-align: left;
  line-height: 18px;
}
</style>


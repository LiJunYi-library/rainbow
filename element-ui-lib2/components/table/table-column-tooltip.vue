


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
    renderDefaultSlot() {
      return (props) => {
        let str = this.getValue(props);
        let tooltipAttrs = objectFilter(this.$attrs, /_tooltip/g);
        let attrs = { placement: "top", ...tooltipAttrs };
        // return 99999999

        // return (
        //   <el-tooltip {...attrs}>
        //     <div slot="content">
        //       多行信息
        //       <br />
        //       第二行信息
        //     </div>
        //     <div class="table-column-lib">{str}</div>
        //   </el-tooltip>
        // );

        return this.$createElement(
          "el-tooltip",
          {
            attrs,
          },
          [
            <div class="table-column-lib">{str}</div>,
            <template slot="content">{this.renderTooltipContentSlot(props)}</template>,
          ]
        );
      };
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



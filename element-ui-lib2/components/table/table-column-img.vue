<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";
export default {
  extends: tableColumn,
  methods: {
    renderDefault(props) {
      let src = this.getValue(props);
      let previewSrcList = [src];
      let imageAttrs = objectFilter(this.$attrs, /_image/g);
      let attrs = {
        src,
        previewSrcList,
        ...imageAttrs,
      };
      let style = {
        width: "50px",
        height: "50px",
      };
      return this.$createElement("el-image", { attrs, style });
    },
  },
};
</script>


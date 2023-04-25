<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";
export default {
  props: {
    imgStyle: Object,
    size: {
      type: [String, Number],
      default: 50,
    },
  },
  extends: tableColumn,
  methods: {
    bindDefaultAttrs() {
      return { width: 100 };
    },
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
        width: `${this.size}px`,
        height: `${this.size}px`,
      };
      return this.$createElement("el-image", {
        attrs,
        style: this.imgStyle || style,
      });
    },
  },
};
</script>


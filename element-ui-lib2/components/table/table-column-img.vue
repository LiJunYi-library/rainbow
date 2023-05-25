<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";
export default {
  extends: tableColumn,

  props: {
    imgStyle: Object,
    popoverImgStyle: Object,
    size: {
      type: [String, Number],
      default: 50
    },
    popoverSize: {
      type: [String, Number],
      default: 500
    }
  },
  methods: {
    bindDefaultAttrs() {
      return { width: 100 }
    },
    renderDefault(props) {
      const src = this.getValue(props)
      const previewSrcList = [src]
      const imageAttrs = objectFilter(this.$attrs, /_image/g)
      const attrs = {
        src,
        previewSrcList,
        ...imageAttrs
      }

      const style = {
        width: `${this.size}px`,
        height: `${this.size}px`
      }

      const popoverImgStyle = {
        width: `${this.popoverSize}px`,
        height: `${this.popoverSize}px`
      }

      const popoverAttrs = objectFilter(this.$attrs, /_popover/g)

      const popoverProps = {
        width: this.popoverSize,
        placement: 'right',
        trigger: 'hover',
        ...popoverAttrs

      }

      return this.$createElement('el-popover', {
        attrs: popoverProps
      }, [
        this.$createElement('img', {
          attrs:{
            src: src,
          },
          style: this.popoverImgStyle || popoverImgStyle
        }),

        this.$createElement('el-image', {
          attrs,
          slot:'reference',
          style: this.imgStyle || style
        })
      ])
    }
  }
}
</script>


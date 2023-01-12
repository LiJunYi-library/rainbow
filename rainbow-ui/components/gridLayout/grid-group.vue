<script>
import { mergeEvent } from "@rainbow_ljy/jsapi";

export default {
  props: {
    space: { type: Number, default: 0 },
    columnNum: { type: Number, default: 5 },
    border: { type: Boolean, default: false },
  },
  data() {
    return {
      gridList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      item: {
        width: `${100 / this.columnNum}%`,
      },
    };
  },
  methods: {
    bindResizeObserver() {
      let timer = mergeEvent(10);
      let resizeObserver = new ResizeObserver(async (...arg) => {
        await timer;
        this.onGridGroupSizeChange(...arg);
      });
      let node = this.$refs["ref-grid-group"];
      resizeObserver.observe(node);
    },
    onGridGroupSizeChange(event, a, b) {
      console.log("监听到了尺寸变化了...", event, a, b);
    },
  },
  mounted() {
    this.bindResizeObserver();
  },

  render() {
    return (
      <div class="grid-group" ref="ref-grid-group">
        {this.gridList.map((el, index) => {
          let nth = index + 1;
          let style = {
            // width: this.item.width,
            paddingRight: nth % this.columnNum === 0 ? 0 : this.space + "px",
            paddingTop: index < this.columnNum ? 0 : this.space + "px",
            borderRightWidth: nth % this.columnNum === 0 ? 0 : 1 + "px",
            borderTopWidth: index < this.columnNum ? 0 : 1 + "px",
          };
          return (
            <div class="grid-item" style={style}>
              <div class="grid-item-content">
                {"" + el + el + el + el + el + el + el + el}{" "}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};
</script>
<style>
.grid-group {
  display: flex;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  /* padding: ;
   margin: ; */
  /* border-right: ; */
}

.grid-item {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  max-width: 300px;
  /* min-width: 200px; */
}

.grid-item-content {
  background: rgba(153, 205, 50, 0.521);
}
</style>
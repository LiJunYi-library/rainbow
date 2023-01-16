<script>
import {
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";

import { renderSlot, getSlotVnode } from "../../utils/index";

export default {
  props: {
    space: { type: Number, default: 10 },
    columnNum: { type: Number, default: 4 },
    border: { type: Boolean, default: false },
    square: { type: Boolean, default: false },

    minItemWidth: { type: Number, default: 300 },
  },
  watch: {
    columnNum() {
      this.column_num = this.columnNum;
    },
  },
  data() {
    return {
      listData: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      // listData:[],

      gridItems: [],
      column_num: this.columnNum,
      item: {
        width: 0,
      },
      onceResizeObserver: new ResizeObserver(() => 0),
      resizeObserver: new ResizeObserver(() => 0),
      width: 0,
    };
  },
  created() {},
  methods: {
    bindResizeObserver() {
      this.onceResizeObserver = r_onceResizeObserver(
        this.$refs["ref-grid-group"],
        this.onGridGroupSizeChange
      );

      this.resizeObserver = r_mergeResizeObserver(
        this.$refs["ref-grid-group"],
        this.onGridGroupSizeChange,
        {
          mergeTime: 20,
        }
      );
    },
    onGridGroupSizeChange(entries, ob) {
      // console.log(this);
      // console.log("监听到了尺寸变化了...", entries, ob);
      let entrie = entries[0] || {};
      let contentRect = entrie.contentRect || {};
      if (this.width === contentRect.width) return;
      this.width = contentRect.width || 0;
      // console.log("监听到了尺寸变化了...", this.width);
      this.setItemWidth();
    },
    setItemWidth() {
      if (!this.minItemWidth) {
        this.item.width =
          (this.width - (this.column_num - 1) * this.space) / this.column_num;
        return;
      }

      let columnNum = this.width / this.minItemWidth;
      columnNum = Math.floor(columnNum);
      columnNum = columnNum <= 0 ? 1 : columnNum;
      // console.log(columnNum);
      let surplusW =
        this.width -
        columnNum * this.minItemWidth -
        (columnNum - 1) * this.space;
      let averageW = surplusW / columnNum;
      let itemW = averageW + this.minItemWidth;

      this.item.width = itemW;
      this.column_num = columnNum;
      console.log(this.column_num);
      this.$emit("update:columnNum", this.column_num);
    },

    renderDefaultItem(pop) {
      return <div class="r-grid-item-content">{"" + pop.item}</div>;
    },

    renderFrame(renderCallBack) {
      return (ele, index) => {
        let nth = index + 1;
        let style = {
          width: this.item.width + "px",
          marginRight: nth % this.column_num === 0 ? 0 : this.space + "px",
          marginTop: index < this.column_num ? 0 : this.space + "px",
        };
        if (this.square) style.height = this.item.width + "px";
        return (
          <div class="r-grid-item" style={style}>
            {renderCallBack(ele, index)}
          </div>
        );
      };
    },
  },

  render() {
    let paddingStr = this.border ? `padding:${this.space}px;` : "";
    let renderList = this.listData.length ? this.listData : this.gridItems;
    let renderItem = (item, index) => {
      if (this.listData.length)
        return renderSlot.call(
          this,
          "item",
          {
            item,
            index,
          },
          this.renderDefaultItem
        );

      return renderSlot.call(item, "default");
    };
    return (
      <div class="r-grid-group" ref="ref-grid-group" style={paddingStr}>
        <div v-show={false}>{renderSlot.call(this, "default")}</div>
        {renderList.map((ele, index) => {
          let nth = index + 1;
          let style = {
            width: this.item.width + "px",
            marginRight: nth % this.column_num === 0 ? 0 : this.space + "px",
            marginTop: index < this.column_num ? 0 : this.space + "px",
          };
          if (this.square) style.height = this.item.width + "px";
          return (
            <div class="r-grid-item" style={style}>
              {renderItem(ele, index)}
            </div>
          );
        })}

        <div class="rgrid-end" style={{ marginTop: this.space + "px" }}>
          {renderSlot.call(this, "end")}
        </div>
      </div>
    );
  },

  mounted() {
    this.bindResizeObserver();
  },
  beforeDestroy() {
    if (this.onceResizeObserver) this.onceResizeObserver.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  },
};
</script>
<style>
.r-grid-group {
  display: flex;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(3, 247, 247, 0.521);
}

.r-grid-item {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  background: rgba(153, 205, 50, 0.521);
}

.r-grid-item-content {
  background: rgba(153, 205, 50, 0.521);
  height: 100%;
}
</style>
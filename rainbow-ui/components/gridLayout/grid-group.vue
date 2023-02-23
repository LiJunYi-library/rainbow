<script>
import {
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";

import { renderSlot } from "../../utils/index";

export default {
  props: {
    space: { type: Number, default: 0 },
    columnNum: { type: Number, default: 4 },
    border: { type: Boolean, default: false },
    square: { type: Boolean, default: false },
    data: { type: Array, default: () => [] },

    minItemWidth: { type: Number, default: 0 },
  },
  watch: {
    columnNum() {
      this.column_num = this.columnNum;
    },
  },
  data() {
    return {
      gridItems: [],
      column_num: this.columnNum,
      row_num: 0,
      item: {
        width: 0,
      },
      residueWidth: 0,
      onceResizeObserver: new ResizeObserver(() => 0),
      resizeObserver: new ResizeObserver(() => 0),
      width: 0,
      renderList: [],
    };
  },
  created() {
    this.renderList =
      (this.data.length ? this.data : this.$slots.default) || [];
    // console.log(" this.renderList ", this.renderList);
  },
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
      let gridEndOffset = this.$refs["rgrid-end"].getBoundingClientRect();
      // console.log("监听到了尺寸变化了...", gridEndOffset);
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
      // console.log("this.item.width", this.item.width);
      // console.log("this.column_num", this.column_num);
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
    renderEmpty() {
      return renderSlot.call(
        this,
        "empty",
        {},
        null,
        <div class="r-grid-group-empty">暂无数据</div>
      );
    },
    renderContent() {
      let paddingStr = this.border ? `padding:${this.space}px;` : "";
      this.renderList =
        (this.data.length ? this.data : this.$slots.default) || [];

      let renderItem = (item, index) => {
        if (this.data.length)
          return renderSlot.call(
            this,
            "item",
            {
              item,
              index,
            },
            this.renderDefaultItem
          );
        return item;
        //  console.log(item.$slots.default);
        // return item.$slots.default;
      };
      // console.log(this.$slots.default);
      // <div v-show={false}>{renderSlot.call(this, "default")}</div>

      return (
        <div class="r-grid-group" ref="ref-grid-group" style={paddingStr}>
          {this.renderList.map((ele, index) => {
            let nth = index + 1;
            let style = {
              width: this.item.width + "px",
              marginRight: nth % this.column_num === 0 ? 0 : this.space + "px",
              marginTop: index < this.column_num ? 0 : this.space + "px",
            };
            if (this.square) style.height = this.item.width + "px";
            return (
              <div class="r-grid-item 969" style={style}>
                {renderItem(ele, index)}
              </div>
            );
          })}
          {this.renderEnd()}
        </div>
      );
    },
    renderEnd() {
      let top = this.column_num > this.renderList.length ? 0 : this.space;
      return (
        <div
          ref="rgrid-end"
          class="rgrid-end"
          style={{
            marginTop: top + "px",
          }}
        >
          {renderSlot.call(this, "end")}
        </div>
      );
    },
  },

  render() {
    return <div>{this.renderContent()}</div>;
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
  /* background: rgba(3, 247, 247, 0.521); */
}

.r-grid-group-empty {
  text-align: center;
  line-height: 200px;
}

.r-grid-item {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  /* background: rgba(153, 205, 50, 0.521); */
}

.r-grid-item-content {
  height: 100%;
  /* background: rgba(153, 205, 50, 0.521); */
}
</style>
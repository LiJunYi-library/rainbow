<!--  板栗  不要忘记他的高度
   双向绑定  page 
   参数 data数据 scrollType滑倒类型`column`|`auto`
   事件 scrollToEnd当滑倒底部 minColumnScrollToEnd最短一列滑倒最底部
   slot item  header  footer
  <r-virtual-list-falls
      :page.sync="req.page"
      :data="listData"
      @scrollToEnd="getList"
    >
      <template slot="item" slot-scope="{ item, index }">
        <div class="r-virtual-list-falls-item">
          <div>
            <img v-if="index !== 1" style="width: 100%" :src="item.p" alt="" />
          </div>
          <div class="--">www:{{ index }}</div>
          <div class="--">{{ item.a }}</div>
          <div class="--">{{ item.b }}</div>
          <div class="--">{{ item.c }}</div>
        </div>
     </template>
  </r-virtual-list-falls>
 -->

<script>
import { renderSlot, getSlotVnode } from "../../utils/index";
import {
  mergeEvent,
  r_resizeObserver,
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";

let VirtualListItem = {
  props: {
    index: Number,
    itemNode: Object,
  },
  data() {
    return {
      resizeObserver: null,
    };
  },
  methods: {
    setItemNode(rect) {
      if (this.itemNode.isCache) {
        if (this.itemNode.height !== rect.height) {
          let size = Math.floor(rect.height - this.itemNode.height);
          if (size <= 0.5) return;
          // console.log(this.index, "高度不", this.itemNode.height, rect.height);
          let celcH = rect.height - this.itemNode.height;
          this.itemNode.height = rect.height;
          this.itemNode.bottom += celcH;
          this.itemNode.layout(this.index);
        }
        return;
      }

      let minCol = this.$parent.findMinHeightColumn();
      let space = this.index < this.$parent.columnNum ? 0 : this.$parent.space;

      this.itemNode.top = minCol.height + space;
      minCol.height += rect.height + space;
      this.itemNode.height = rect.height;
      this.itemNode.bottom = minCol.height;

      this.itemNode.left = minCol.left;
      this.itemNode.width = minCol.width;
      this.itemNode.right = minCol.right;

      let maxColumn = this.$parent.columns.obtainMax((el) => el.height);
      this.$parent.contentHeight = maxColumn.height;
      this.itemNode.parent = minCol;

      this.itemNode.isCache = true;
      if (this.$parent.listItems.length - 1 === this.index) {
        this.$parent.$forceUpdate();
      }

      //
    },
    creatResizeObserver() {
      this.resizeObserver = r_resizeObserver(this.$el.firstChild, (event) => {
        // let contentRect = event[0].contentRect;
        let rect = this.$el.firstChild.getBoundingClientRect();
        // console.log(this.index, "on高度不同", event);
        this.setItemNode(rect);
      });
    },
    destroyResizeObserver() {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    },
  },
  render() {
    // console.log(this.index, "VirtualListItem render");
    this.itemNode.width = this.$parent.columnWidth;

    let { top, height, width, left, parent } = this.itemNode;

    let style = {
      width: width + "px",
      height: height + "px",
      left: left + "px",
      top: top + "px",
    };

    return (
      <div class="r-virtual-list-falls-frame-item" style={style}>
        <div class="r-over-hidden">{renderSlot.call(this, "default")}</div>
      </div>
    );
  },
  created() {
    // console.log("created", this.$parent);
  },
  beforeUpdate() {
    // console.log(this.index, "beforeUpdate  VirtualListItem", this.$el);
  },
  updated() {
    // console.log(this.index, "updated  VirtualListItem", this.$el);
  },
  beforeDestroy() {
    // console.log('VirtualListItem beforeDestroy');
    this.destroyResizeObserver();
  },
  mounted() {
    // console.log("VirtualListItem  mounted");
    this.creatResizeObserver();
    let contentRect = this.$el.firstChild.getBoundingClientRect();
    this.setItemNode(contentRect);
  },
};

class NodeCache {
  vm = null; //vue
  prveNode = null; //上一个
  nextNode = null; //下一个
  show = true; //是否render
  isCache = false; //是否缓存
  top = null; //top
  height = null; //height
  bottom = null; //bottom
  left = null; //left
  width = null; //width
  right = null; //right
  parent = null; //parent

  constructor(props) {
    Object.assign(this, props);
    this.isShow = true;
  }

  get isShow() {
    return this.show;
  }

  set isShow(value) {
    if (this.show !== value) this.onWatchShow(value);
    this.show = value;
  }

  async layout(index) {
    this.vm.layout(index);
  }

  onWatchShow() {
    this.vm.$forceUpdate();
  }

  getIsShow(top, bottom, event) {
    let visible = true;
    if (top > this.bottom) visible = false;
    if (this.top > bottom) visible = false;
    return visible;
  }

  onScroll(top, bottom, event) {
    this.isShow = this.getIsShow(top, bottom, event);
  }
}

let VirtualListHeader = {
  render() {
    return (
      <div class="r-virtual-list-falls-header">
        {renderSlot.call(this, "default")}
      </div>
    );
  },
  mounted() {
    let offset = this.$el.getBoundingClientRect();
    this.$parent.headerHeight = offset.height;
  },
};

export default {
  components: {
    VirtualListItem,
    VirtualListHeader,
  },
  props: {
    space: { type: Number, default: 10 },
    columnNum: { type: Number, default: 2 },
    triggerScrollToEndDistance: { type: Number, default: 10 },
    keyExtractor: { type: Function, default: (item, index) => index },
    scrollType: { type: String, default: `column` }, //滑倒类型`column`|`auto`

    page: { type: Number, default: 1 },
    data: { type: Array, default: [] },
  },
  data() {
    let columns = [];
    for (let index = 0; index < this.columnNum; index++) {
      columns.push(
        new NodeCache({
          isCache: false,
          vm: this,
          height: 0,
          top: 0,
          bottom: 0,
          tag: "column",
        })
      );
    }

    this.contentWidth = 0;
    this.contentHeight = 0;
    this.columns = columns;
    this.page_ = this.page;
    this.windowHeight = window.innerHeight;
    this.columnWidth = 0;
    this.headerHeight = 0;
    this.isMount = false;
    return {
      resizeObserver: null,
    };
  },
  watch: {
    page() {
      this.page_ = this.page;
    },
  },
  computed: {
    listItems() {
      for (let index = 0; index < this.data.length; index++) {
        if (!this.data[index].__save__) {
          let ob = this.data[index] || {};
          Object.defineProperties(ob, {
            __save__: {
              value: new NodeCache({ isCache: false, vm: this }),
            },
          });
        }
      }
      return this.data;
    },
  },
  methods: {
    setColumns(rect) {
      let offset = rect || this.$el.getBoundingClientRect();
      this.contentWidth = offset.width;
      let { columnNum, space, columns } = this;
      this.columnWidth = (offset.width - (columnNum - 1) * space) / columnNum;
      let left = 0;
      columns.forEach((column, index) => {
        column.height = 0;
        column.left = left;
        column.width = this.columnWidth;
        column.right = left + this.columnWidth;
        if (index < columns.length - 1) left = column.right + space;
      });
      // console.log(columns);
    },
    resetListItems() {
      this.listItems.forEach((item, index) => {
        let cacheData = item.__save__;
        cacheData.show = true;
        cacheData.isShow = true;
        cacheData.isCache = false;
        cacheData.top = null;
        cacheData.height = null;
        cacheData.bottom = null;
        cacheData.left = null;
        cacheData.width = null;
        cacheData.right = null;
        cacheData.parent = null;
      });
    },
    layout($index) {
      // console.log(",,,,,,,,,,,,layout", $index);

      /** 局部更新 */
      let task = [];
      let nth = $index;
      while (nth >= 0 && task.length < this.columnNum) {
        let mCatch = this.listItems[nth].__save__;
        let mColumn = mCatch.parent;
        if (!task.some((el) => el.parent === mColumn)) task.push(mCatch);
        nth--;
      }

      this.columns.forEach((col) => (col.height = 0));
      task.forEach((ca) => {
        ca.parent.height = ca.bottom;
      });

      for (let index = $index + 1; index < this.listItems.length; index++) {
        const cacheData = this.listItems[index].__save__;
        let minCol = this.findMinHeightColumn();
        let space = index < this.columnNum ? 0 : this.space;
        cacheData.top = minCol.height + space;
        minCol.height += cacheData.height + space;
        cacheData.bottom = minCol.height;
        cacheData.left = minCol.left;
        cacheData.width = minCol.width;
        cacheData.right = minCol.right;
        cacheData.parent = minCol;
      }

      let maxColumn = this.columns.obtainMax((el) => el.height);
      this.contentHeight = maxColumn.height;
      this.$forceUpdate();

      // ↓↓↓↓↓  全部更新
      // this.listItems.forEach((item, index) => {
      //   let cacheData = item.__save__;
      //   let minCol = this.findMinHeightColumn();
      //   let space = index < this.columnNum ? 0 : this.space;

      //   cacheData.top = minCol.height + space;
      //   minCol.height += cacheData.height + space;
      //   cacheData.bottom = minCol.height;

      //   cacheData.left = minCol.left;
      //   cacheData.width = minCol.width;
      //   cacheData.right = minCol.right;
      //   cacheData.parent = minCol;
      // });

      // let maxColumn = this.columns.obtainMax((el) => el.height);
      // this.contentHeight = maxColumn.height;

      // this.$forceUpdate();
    },
    renderItem(item, index, list) {
      return (
        <div class="r-virtual-list-falls-item">
          <div class="--"> 默认item </div>
          <div class="--"> {item.a}</div>
          <div class="--"> {item.b} </div>
          <div class="--"> {item.c} </div>
        </div>
      );
    },
    renderHeader() {
      return null;
      return (
        <div class="--">
          <div class="--"> 默认头 </div>
          <div class="--"> 默认头 </div>
          <div class="--"> 默认头 </div>
          <div class="--"> 默认头 </div>
          <div class="--"> 默认头 </div>
          <div class="--"> 默认头 </div>
          <div class="--"> 默认头 </div>
        </div>
      );
    },
    renderFooter() {
      return null;
      return (
        <div class="--">
          <div class="--"> 默认尾 </div>
          <div class="--"> 默认尾 </div>
          <div class="--"> 默认尾 </div>
          <div class="--"> 默认尾 </div>
          <div class="--"> 默认尾 </div>
          <div class="--"> 默认尾 </div>
        </div>
      );
    },
    onScroll(event) {
      // console.log("onScroll", event.target.scrollTop);
      let target = event.target;
      let scrollTop = target.scrollTop - this.headerHeight - this.space;
      let scrollBottom = scrollTop + this.windowHeight;

      this.listItems.forEach((item) => {
        item.__save__.onScroll(scrollTop, scrollBottom, event);
      });

      // console.log("onScroll", scrollBottom);
      if (
        scrollBottom >=
        this.contentHeight - this.triggerScrollToEndDistance
      ) {
        this.onScrollToEnd();
      }

      let minColumn = this.findMinHeightColumn();

      if (scrollBottom >= minColumn.height - this.triggerScrollToEndDistance) {
        this.onMinColumnScrollToEnd();
      }
    },
    onMinColumnScrollToEnd() {
      if (this.scrollType !== "column") return;
      this.page_++;
      this.$emit("minColumnScrollToEnd");
      this.$emit("update:page", this.page_);
    },
    onScrollToEnd() {
      if (this.scrollType !== "auto") return;
      this.page_++;
      this.$emit("scrollToEnd");
      this.$emit("update:page", this.page_);
    },
    awaitTime() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    },
    findMinHeightColumn() {
      return this.columns.obtainMin((el) => el.height);
    },
    onClick() {},
    creatResizeObserver() {
      this.resizeObserver = r_resizeObserver(this.$el, (event) => {
        let contentRect = event[0].contentRect;
        if (this.contentWidth !== contentRect.width) {
          // console.log("宽度不同", contentRect);
          this.setColumns(contentRect);
          this.resetListItems();
          this.$forceUpdate();
        }
      });
    },
    destroyResizeObserver() {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    },
  },
  created() {
    // console.log("virtual-list  created", this);
    // document.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    // console.log("virtual-list  beforeDestroy", this);
    // document.removeEventListener("scroll", this.onScroll);
    this.destroyResizeObserver();
  },
  beforeMount() {},
  mounted() {
    // console.log("virtual-list  mounted", this);
    this.creatResizeObserver();
    let contentRect = this.$el.getBoundingClientRect();
    this.setColumns(contentRect);
    this.isMount = true;
    if (this.listItems.length) this.$forceUpdate();
  },
  beforeUpdate() {},
  updated() {},
  render() {
    // console.log("virtual-list-falls          render");

    return (
      <div class="r-virtual-list-falls" onScroll={this.onScroll}>
        <VirtualListHeader>
          {renderSlot.call(this, "header", {}, this.renderHeader)}
        </VirtualListHeader>
        <div
          class="r-virtual-list-falls-frame"
          style={`height: ${this.contentHeight}px;`}
        >
          {this.isMount &&
            this.listItems.map((item, index) => {
              if (!item.__save__) return null;
              if (!item.__save__.isShow) return null;
              return (
                <VirtualListItem
                  key={this.keyExtractor(item, index)}
                  itemNode={item.__save__}
                  index={index}
                >
                  {renderSlot.call(
                    this,
                    "item",
                    { item, index },
                    this.renderItem
                  )}
                </VirtualListItem>
              );
            })}
        </div>
      </div>
    );
  },
};
</script>

<style>
.r-virtual-list-falls {
  width: 375px;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  /* background: rgb(247, 226, 254); */
  box-sizing: border-box;
}

.r-virtual-list-falls-header {
  overflow: hidden;
}

.r-virtual-list-falls-frame {
  overflow: hidden;
  position: relative;
  /* background: rgba(144, 0, 255, 0.521); */
}

.r-virtual-list-falls-frame-item {
  /* background: rgba(226, 25, 25, 0.8); */
  position: absolute;
  overflow: hidden;
}

.r-over-hidden {
  overflow: hidden;
}

/* .r-virtual-list-falls::-webkit-scrollbar {
  width: 0px;
} */

.r-virtual-list-falls-item {
  background: rgba(226, 209, 25, 0.8);
  font-size: 20px;
  padding: 15px 15px;
  /* margin-bottom: 15px; */
  word-break: break-all;
}
</style>


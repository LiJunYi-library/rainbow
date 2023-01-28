
<script>
import { renderSlot, getSlotVnode } from "../../utils/index";
import {
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";

let VirtualListItem = {
  props: {
    index: Number,
    itemNode: Object,
  },
  data() {
    return {};
  },
  methods: {
    setItemNode() {
      if (this.itemNode.isCache) return;
      let offset = this.$el.firstChild.getBoundingClientRect();
      let column = this.$parent.findMinHeightColumn();
      let space = this.index < this.$parent.columnNum ? 0 : this.$parent.space;

      this.itemNode.top = column.height + space;
      column.height += offset.height + space;
      this.itemNode.height = offset.height;
      this.itemNode.bottom = column.height;

      this.itemNode.left = column.left;
      this.itemNode.width = column.width;
      this.itemNode.right = column.right;
      this.itemNode.isCache = true;

      let maxColumn = this.$parent.columns.obtainMax((el) => el.height);
      this.$parent.height = maxColumn.height;
    },
    onParentMounted() {
      debugger;
      console.log("onParentMounted");
      // this.setItemNode();
    },
  },
  render() {
    console.log(this.$parent.isMounted);
    if (!this.$parent.isMounted) return;
    console.log(this.index);
    debugger;

    let { top, height, width, left, parent } = this.itemNode;
    let column = this.$parent.findMinHeightColumn();
    if (parent === null) parent = column;
    if (width === null) width = column.width;
    if (left === null) left = column.left;
    if (top === null) top = column.height;

    let style = {
      width: width + "px",
      height: height + "px",
      left: left + "px",
      top: top + "px",
    };

    // console.log(top, height, width, left);

    return (
      <div class="r-virtual-frame-item" style={style}>
        <div class="r-over-hidden">{renderSlot.call(this, "default")}</div>
      </div>
    );
  },
  created() {
    this.$parent.mountedEvents.push(this.onParentMounted);
    // console.log("created", this.$parent);
  },
  beforeDestroy() {
    this.$parent.mountedEvents.remove(this.onParentMounted);
    // console.log('beforeDestroy');
  },
  beforeUpdate() {
    console.log(this.index, "beforeUpdate  VirtualListItem", this.$el);
    debugger;
  },
  updated() {
    // console.log(this.index, "updated  VirtualListItem", this);
    // debugger;
  },
  mounted() {
    // console.log("VirtualListItem  mounted", this.$parent);
  },
};

class NodeCache {
  vm = null; //vue
  prveNode = null; //上一个
  show = true; //是否render
  isCache = false; //是否缓存
  top = null; //top
  height = null; //height
  bottom = null; //bottom
  left = null; //left
  width = null; //width
  right = null; //right
  parent = null;
  children = [];

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
      <div class="r-virtual-list-header">
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
    page: { type: Number, default: 1 },
    data: { type: Array, default: [] },
    columnNum: { type: Number, default: 3 },
    triggerScrollToEndDistance: { type: Number, default: 10 },
    keyExtractor: {
      type: Function,
      default(item, index) {
        return index;
      },
    },
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
        })
      );
    }

    return {
      page_: this.page,

      width: 0,
      height: 0,
      windowHeight: window.innerHeight,
      columns,
      columnWidth: 0,
      headerHeight: 0,

      mountedEvents: [],
      isMounted: false,
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
    renderItem(item, index, list) {
      return (
        <div class="r-virtual-list-item">
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
      let scrollTop = event.target.scrollTop - this.headerHeight - this.space;
      let scrollBottom = scrollTop + this.windowHeight;

      this.listItems.forEach((item) => {
        item.__save__.onScroll(scrollTop, scrollBottom, event);
      });

      // console.log("scrollTop", scrollBottom);
      if (scrollBottom >= this.height - this.triggerScrollToEndDistance) {
        this.onScrollToEnd();
      }
    },
    onScrollToEnd() {
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
  },
  created() {
    // console.log("virtual-list  created", this);
  },
  beforeMount() {
    // console.log("virtual-list  beforeMount");
  },
  mounted() {
    this.isMounted = true;
    this.mountedEvents.forEach((event) => {
      event();
    });
    // console.log("virtual-list  mounted", this);
  },
  beforeUpdate() {
    // console.log( "beforeUpdate  ", this.height);
  },
  updated() {
    // console.log("virtual-list updated 更新更新更新更新更新 ");
  },
  render() {
    debugger;
    return (
      <div
        ref="ref-virtual-list"
        class="r-virtual-list"
        onScroll={this.onScroll}
      >
        <VirtualListHeader>
          {renderSlot.call(this, "header", {}, this.renderHeader)}
        </VirtualListHeader>
        <div
          ref="ref-virtual-frame"
          class="r-virtual-frame"
          style={`height: ${this.height}px;`}
        >
          {this.listItems.map((item, index) => {
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
        {renderSlot.call(this, "footer", {}, this.renderFooter)}
      </div>
    );
  },
};
</script>

<style>
</style>


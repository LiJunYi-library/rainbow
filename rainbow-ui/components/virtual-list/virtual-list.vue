
<script>
import { renderSlot, getSlotVnode } from "../../utils/index";
import {
  mergeEvent,
  r_resizeObserver,
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";
import VirtualListHeader from "./virtual-list-header.vue";

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
    setItemNode() {
      let offset = this.$el.firstChild.getBoundingClientRect();
      let pOffset = this.$parent.$el.getBoundingClientRect();

      if (this.itemNode.isCache) {
        let updataH = offset.height - this.itemNode.height;
        let size = Math.floor(updataH);

        console.log("打补丁", this.index, offset);
        console.log(
          "打补丁+++",
          offset.height,
          this.itemNode.height,
          this.itemNode
        );

        this.itemNode.top = offset.top - pOffset.top;
        this.itemNode.height = offset.height;
        this.itemNode.bottom = offset.bottom - pOffset.top;
        this.$parent.contentHeight += updataH;
        this.$parent.$forceUpdate();
        return;
      }
      let space = this.index < this.$parent.columnNum ? 0 : this.$parent.space;
      console.log("缓存", this.index, offset);

      this.itemNode.top = offset.top - pOffset.top;
      this.itemNode.height = offset.height;
      this.itemNode.bottom = offset.bottom - pOffset.top;
      this.itemNode.isCache = true;

      this.$parent.contentHeight += offset.height;
      if (this.$parent.listItems.length - 1 === this.index) {
        this.$parent.$forceUpdate();
      }
    },
    creatResizeObserver() {
      this.resizeObserver = r_resizeObserver(this.$el.firstChild, (event) => {
        this.setItemNode();
      });
    },
    destroyResizeObserver() {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    },
  },
  render() {
    let style = {
      width: "100%",
      height: `${this.$parent.itemHeight}px`,
    };

    // console.log(top, height, width, left);

    return (
      <div
        class="r-virtual-list-item"
        style={style}
        h={this.itemNode.height}
        t={this.itemNode.top}
        b={this.itemNode.bottom}
      >
        <div class="r-over-hidden">{renderSlot.call(this, "default")}</div>
      </div>
    );
  },
  created() {
    // console.log("created", this.$parent);
  },
  beforeUpdate() {
    // console.log("beforeUpdate  VirtualListItem");
  },
  updated() {
    // console.log(this.index, "updated  VirtualListItem", this);
  },
  mounted() {
    // console.log("VirtualListItem  mounted", this.index, this.itemNode);
    // this.creatResizeObserver();
  },
  beforeDestroy() {
    // console.log('beforeDestroy');
    // this.destroyResizeObserver();
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

  onWatchShow(bool) {
    debugger;
    console.log(bool);
    if (!bool) this.vm.recycleHeight += this.height;
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
    itemHeight: {
      type: Number,
      default: 300,
    },
  },
  data() {
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.windowHeight = window.innerHeight;
    this.columnWidth = 0;
    this.headerHeight = 0;
    this.isMount = false;
    this.recycleHeight = 0;
    return {
      page_: this.page,

      // contentWidth: 0,
      // contentHeight: 0,
      // windowHeight: window.innerHeight,
      // columnWidth: 0,
      // headerHeight: 0,
      // isMount: false,
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
      let target = event.target;
      let scrollTop = target.scrollTop - this.headerHeight;
      let scrollBottom = scrollTop + this.windowHeight;

      this.listItems.forEach((item) => {
        item.__save__.onScroll(scrollTop, scrollBottom, event);
      });

      // console.log("onScroll", scrollBottom);
      let endDistance = this.triggerScrollToEndDistance;
      if (scrollBottom >= this.contentHeight - endDistance) {
        this.onScrollToEnd();
      }
    },
    onScrollToEnd() {
      this.page_++;
      this.$emit("update:page", this.page_);
      this.$emit("scrollToEnd");
    },
    awaitTime() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    },
  },
  created() {
    // console.log("virtual-list  created", this);
  },
  beforeMount() {
    // console.log("virtual-list  beforeMount", this);
  },
  mounted() {
    // console.log("virtual-list  mounted", this);
    this.isMount = true;
    if (this.listItems.length) this.$forceUpdate();
  },
  beforeUpdate() {
    // console.log( "virtual-list beforeUpdate  ", this);
  },
  updated() {
    // console.log("virtual-list updated ", this);
  },
  render() {
    this.contentHeight = this.listItems.length * this.itemHeight;
    return (
      <div class="r-virtual-list" onScroll={this.onScroll}>
        <VirtualListHeader>
          {renderSlot.call(this, "header", {}, this.renderHeader)}
        </VirtualListHeader>
        <div
          class="r-virtual-list-frame"
          style={`height: ${this.contentHeight}px;`}
        >
          <div style={`height: ${this.recycleHeight}px;`}></div>
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
        {renderSlot.call(this, "footer", {}, this.renderFooter)}
      </div>
    );
  },
};
</script>

<style>
.r-virtual-list {
  width: 375px;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  background: rgb(247, 226, 254);
  box-sizing: border-box;
}

.r-virtual-list-header {
  overflow: hidden;
}

.r-virtual-list-frame {
  overflow: hidden;
  position: relative;
  background: rgba(144, 0, 255, 0.521);
}
</style>


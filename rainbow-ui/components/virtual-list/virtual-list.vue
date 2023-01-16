
<script>
import { renderSlot, getSlotVnode } from "../../utils/index";

let VirtualListItem = {
  props: {
    index: Number,
    itemNode: Object,
  },
  data() {
    return {
      scrollTop: 0,
    };
  },
  methods: {
    onScroll(event) {
      this.scrollTop = event.target.scrollTop;
      // console.log("VirtualListItem", event.target.scrollTop);
      // console.log(this.index, "onScroll", this.scrollTop, this.offset.bottom);
    },
  },
  render() {
    let { top, height } = this.itemNode;
    let tt = ``;
    if (top || top === 0) tt = `top:${top}px;`;
    let hh = ``;
    if (height || height === 0) hh = `height:${height}px;`;
    let style = `position:absolute;left:0px;width:100%;${tt}${hh}`;
    return <div style={style}>{renderSlot.call(this, "default")} </div>;
  },
  created() {
    // this.$parent.scrollEvents.push(this.onScroll);
  },
  beforeUpdate() {
    // console.log(this.index, "beforeUpdate  VirtualListItem", this.$el);
  },
  updated() {
    // console.log(this.index, "updated  VirtualListItem", this.$el);
  },
  beforeDestroy() {
    // this.$parent.scrollEvents.remove(this.onScroll);
  },
  mounted() {
    if (!this.itemNode.isCache) {
      let element = this.$el.firstChild;
      this.itemNode.top = this.$parent.height;
      this.$parent.height += element.clientHeight;
      this.itemNode.height = element.clientHeight;
      this.itemNode.bottom = this.$parent.height;
      this.itemNode.isCache = true;

      console.log(
        this.index,
        "mounted  VirtualListItem",
        element.clientHeight,
        [element]
      );
    }
  },
};

let VirtualListframe = {};

class ListItem {
  show = true;
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

  onScroll(top, bottom, event) {
    if (top > this.bottom || this.top > bottom) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }
  }
}

export default {
  components: {
    VirtualListItem,
  },
  props: {
    space: { type: Number, default: 10 },
    page: { type: Number, default: 1 },
    data: { type: Array, default: [] },
    triggerScrollToEndDistance: { type: Number, default: 10 },
    keyExtractor: {
      type: Function,
      default(item, index) {
        return index;
      },
    },
  },
  data() {
    return {
      height: 0,
      windowHeight: window.innerHeight,
      page_: this.page,

      scrollEvents: [],
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
              value: new ListItem({
                isCache: false,
                vm: this,
              }),
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
          <div class="--"> {item.a}</div>
          <div class="--"> {item.b} </div>
          <div class="--"> {item.c} </div>
        </div>
      );
    },
    onScroll(event) {
      let scrollTop = event.target.scrollTop;
      let scrollBottom = event.target.scrollTop + this.windowHeight;

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
  },
  mounted() {
    console.log("virtual-list  mounted");
  },
  beforeUpdate() {
    // console.log( "beforeUpdate  ", this.height);
  },
  updated() {
    // console.log( "updated  ", this.height);
    // console.log( "updated  ", this.listItems);
  },
  render() {
    // console.log("-------render-------", this);
    return (
      <div
        ref="ref-virtual-list"
        class="r-virtual-list"
        onScroll={this.onScroll}
      >
        <div class="r-virtual-frame" style={`height: ${this.height}px;`}>
          {this.listItems.map((item, index) => {
            if (!item.__save__.isShow) return null;
            return (
              <VirtualListItem
                key={this.keyExtractor(item, index)}
                itemNode={item.__save__}
                index={index}
              >
                {this.renderItem(item, index)}
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
.r-virtual-list {
  width: 400px;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(144, 0, 255, 0.521);
}

.r-virtual-frame {
  overflow: hidden;
  position: relative;
}

.r-virtual-list-item {
  width: 100%;
  background: rgba(226, 209, 25, 0.8);
  font-size: 20px;
  padding: 15px 0;
  /* margin-bottom: 15px; */
}
</style>
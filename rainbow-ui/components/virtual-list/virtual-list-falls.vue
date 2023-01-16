
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
    // console.log(this.index, "mounted  VirtualListItem", [this.$el]);

    if (!this.itemNode.isCache) {
      let element = this.$el.firstChild;
      this.itemNode.top = this.$parent.height;
      this.$parent.height += element.clientHeight + 15;
      this.itemNode.height = element.clientHeight + 15;
      this.itemNode.bottom = this.$parent.height;
      this.itemNode.isCache = true;
    }
  },
};

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

let createObj = (num) => {
  let str = "";
  let jjj = Math.random() * 40;
  jjj = Math.floor(jjj);
  for (let nth = 0; nth < jjj; nth++) {
    str = str + "我";
  }
  let obj = {
    a: Math.random() + num,
    b: Math.random() + num,
    c: str,
  };
  return obj;
};

let NTH = 0;

let createArr = () => {
  let listData = [];
  for (let index = 1; index <= 10; index++) {
    NTH++;
    listData.push(createObj(NTH));
  }
  return listData;
};

export default {
  components: {
    VirtualListItem,
  },
  props: {
    space: { type: Number, default: 10 },
    columnNum: { type: Number, default: 4 },
  },
  data() {
    return {
      listData: [],
      sliceLength: 10,
      startIndex: 0,
      endIndex: this.startIndex + this.sliceLength,

      height: 0,
      windowHeight: 500,
      scrollEvents: [],
      listItems: [],
    };
  },
  computed: {},
  methods: {
    setListItems() {
      for (let index = 0; index < this.listData.length; index++) {
        // const element = this.listData[index];
        if (!this.listItems[index]) {
          this.listItems[index] = new ListItem({
            data: this.listData[index],
            isCache: false,
            index,
            vm: this,
          });
        }
      }
    },
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
        item.onScroll(scrollTop, scrollBottom, event);
      });

      console.log("scrollTop", scrollBottom);
      if (scrollBottom >= this.height - 10) {
        this.onScrollToEnd();
      }
    },
    onScrollToEnd() {
      console.log("onScrollToEnd");
      let data = createArr();
      this.listData = this.listData.concat(data);
    },
  },
  mounted() {
    let data = createArr();
    this.listData = this.listData.concat(data);
    console.log(this.listData);
  },
  beforeUpdate() {
    console.log(this.index, "beforeUpdate  ", this.height);
  },
  updated() {
    console.log(this.index, "updated  ", this.height);
    console.log(this.index, "updated  ", this.listItems);
  },
  render() {
    this.setListItems();
    console.log("-------render-------");
    return (
      <div
        ref="ref-virtual-list"
        class="r-virtual-list"
        onScroll={this.onScroll}
      >
        <div class="r-virtual-frame" style={`height: ${this.height}px;`}>
          {this.listItems.map((item, index) => {
            if (!item.isShow) return null;
            return (
              <VirtualListItem key={index} itemNode={item} index={index}>
                {this.renderItem(item.data, index)}
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
  margin-bottom: 15px;
}
</style>
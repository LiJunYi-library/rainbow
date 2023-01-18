
<script>
import { renderSlot, getSlotVnode } from "../../utils/index";
import {
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";
import Vue from "vue";

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
    onScroll(event) {},
    setItemNode() {
      if (!this.itemNode.isCache) {
        let element = this.$el.firstChild.getBoundingClientRect();
        // let element = this.$el.firstChild;
        this.itemNode.top = this.$parent.height;
        this.$parent.height += element.height;
        this.itemNode.height = element.height;
        this.itemNode.bottom = this.$parent.height;
        this.itemNode.isCache = true;
      }
    },
  },
  render() {
    let { top, height } = this.itemNode;
    let tt = ``;
    if (top || top === 0) tt = `top:${top}px;`;
    let hh = ``;
    if (height || height === 0) hh = `height:${height}px;`;
    let style = `position:absolute;left:0px;width:100%;${tt}${hh}`;
    return (
      <div style={style}>
        <div style="overflow: hidden;">{renderSlot.call(this, "default")}</div>
      </div>
    );
  },
  created() {
    console.log("created", this.$parent);
  },
  beforeUpdate() {
    // console.log(this.index, "beforeUpdate  VirtualListItem", this.$el);
  },
  updated() {
    // console.log(this.index, "updated  VirtualListItem", this.$el);
  },
  beforeDestroy() {
    // console.log('beforeDestroy');
  },
  mounted() {
    console.log("VirtualListItem  mounted");
    this.setItemNode();
  },
};

let VirtualListframe = {
  props: {
    renderItem: Function,
  },
  data() {
    return {
      height: 0,
    };
  },
  mounted() {
    console.log("VirtualListframe  mounted");
  },
  created() {
    console.log("VirtualListframe created", this.$parent);
    // this.$parent.listframes.push(this);
  },
  beforeDestroy() {
    // this.$parent.listframes.remove(this);
  },
  render() {
    return (
      <div class="r-virtual-frame">{renderSlot.call(this, "default")}</div>
    );
  },
};

class Listframe {
  height = null; //height
  constructor(props) {
    Object.assign(this, props);
  }
}

class ListItem {
  show = true; //是否render
  isCache = false; //是否缓存
  top = null; //top
  height = null; //height
  bottom = null; //bottom
  vm = null; //vue
  prveNode = null; //上一个

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
    VirtualListframe,
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
    ListItem.vm = this;
    // let listframes = [];
    // for (let index = 0; index < this.columnNum; index++) {
    //   listframes.push(new Listframe({ height: 0 }));
    // }

    return {
      page_: this.page,

      height: 0,
      windowHeight: window.innerHeight,

      scrollEvents: [],
      compile: null,
      listframes: [],
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
              value: new ListItem({ isCache: false, vm: this }),
            },
          });
        }
      }
      return this.data;
    },
  },
  methods: {
    // findMinVal(formatter) {
    //   let value = 0;
    //   let index;
    //   let item;
    //   this.listframes.forEach((ele, nth) => {
    //     if (formatter(ele) <= value) {
    //       item = ele;
    //       index = nth;
    //       value = formatter(ele);
    //     }
    //   });
    //   return { item, index, value };
    // },
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
    awaits() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    },
  },
  created() {
    console.log("virtual-list  created", this);
    // this.setCompile();
  },
  async beforeMount() {
    // console.log("virtual-list  beforeMount");
    // console.log(this.$refs["ref-virtual-list"]);
    // console.log("virtual-list  beforeMount");
  },
  mounted() {
    console.log("virtual-list  mounted", this);
    // this.append();
  },
  beforeUpdate() {
    // console.log( "beforeUpdate  ", this.height);
  },
  updated() {
    // console.log("virtual-list updated 更新更新更新更新更新 ");
  },
  render() {
    //  <div
    //       ref="ref-virtual-frame"
    //       class="r-virtual-frame"
    //       style={`height: ${this.height}px;`}
    //     > </div>
    // <VirtualListframe>
    // {this.listItems.map((item, index) => {
    //   if (!item.__save__) return null;
    //   if (!item.__save__.isShow) return null;
    //   return (
    //     <VirtualListItem
    //       key={this.keyExtractor(item, index)}
    //       itemNode={item.__save__}
    //       index={index}
    //     >
    //       {this.renderItem(item, index)}
    //     </VirtualListItem>
    //   );
    // })}
    //     </VirtualListframe>
    // console.log(this.listframes);
    // // debugger
    // let nodes = [];
    // for (let index = 0; index < this.columnNum; index++) {
    //   if(!this.listframes[index]){

    //   }
    //   nodes.push(<VirtualListframe>
    //   {

    //   }
    //   </VirtualListframe>);
    // }

    // this.listItems.forEach((item, index) => {
    //   if(index<this.columnNum){
    //     if(!this.listframes[index])
    //   }
    //   return null;
    // });
    let children = [<div>1</div>, <div>2</div>, <div>3</div>];
    let nnnn = <VirtualListframe>{children}</VirtualListframe>;
    nnnn.children = children;
    console.log(nnnn);
    debugger;
    return (
      <div
        ref="ref-virtual-list"
        class="r-virtual-list"
        onScroll={this.onScroll}
      >
        {nnnn}
        <VirtualListframe></VirtualListframe>
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
  background: rgb(248, 245, 249);
}

.r-virtual-frame {
  overflow: hidden;
  position: relative;
  background: rgba(144, 0, 255, 0.521);

  /* width: 100%;
  min-height: 100px;
  display: inline-block;
  margin-right: 5px; */
}

::-webkit-scrollbar {
  width: 0px;
}

.r-virtual-frame-item {
  width: 100%;
  background: rgba(226, 25, 25, 0.8);
  position: absolute;
  opacity: 0;
  overflow: hidden;
}

.r-virtual-list-item {
  width: 100%;
  background: rgba(226, 209, 25, 0.8);
  font-size: 20px;
  padding: 15px 0;
  margin-bottom: 15px;
}
</style>

<!-- <div>


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
    ListItem.vm = this;
    return {
      height: 0,
      windowHeight: window.innerHeight,
      page_: this.page,

      scrollEvents: [],
      compile: null,
    };
  },
  watch: {
    "data.length": function () {
      // this.measure();
    },
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
              value: new ListItem({ isCache: false, vm: this }),
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
    async measure() {
      let index = 0;
      while (index < this.data.length) {
        if (!this.data[index].__save__) {
          await this.measureItem(this.data[index]);
        }
        index++;
      }
    },
    measureItem(mdata) {
      return new Promise((resolve) => {
        this.compile.mdata = mdata;
        this.compile.resolve(() => {
          resolve(true);
        });
      });
    },
    setCompile() {
      let extend = this.constructor.extend;
      let self = this;

      let compile = Vue.extend({
        props: {
          mdata: { type: Object, default: () => ({}) },
        },
        data() {
          return {
            resolveCallble: () => 0,
          };
        },
        methods: {
          resolve(resolveCallble) {
            this.resolveCallble = resolveCallble;
          },
        },
        render() {
          return (
            <div class="r-virtual-frame-item">
              {self.renderItem(this.mdata, 0)}
            </div>
          );
        },
        router: self.$router,
        store: self.$store,
        updated() {
          let offset = this.$el.getBoundingClientRect();
          if (!this.mdata.__save__) {
            let top = self.height;
            let height = offset.height;
            let bottom = offset.height + self.height;
            self.height = bottom;
            let ob = this.mdata || {};
            Object.defineProperties(ob, {
              __save__: {
                value: new ListItem({
                  isCache: true,
                  top: top,
                  height: height,
                  bottom: bottom,
                }),
              },
            });
          } else {
          }
          this.resolveCallble();
        },
      });
      this.compile = new compile({ el: document.createElement("div") });
    },
    append() {
      let p = this.$refs["ref-virtual-frame"];
      p.appendChild(this.compile.$el);
    },
  },
  created() {
    // console.log("virtual-list  created", this);
    // this.setCompile();
  },
  mounted() {
    // console.log("virtual-list  mounted", this);
    // this.append();
  },
  beforeUpdate() {
    // console.log( "beforeUpdate  ", this.height);
  },
  updated() {
    // console.log("virtual-list updated 更新更新更新更新更新 ");
  },
  render() {
    return (
      <div
        ref="ref-virtual-list"
        class="r-virtual-list"
        onScroll={this.onScroll}
      >
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
                {this.renderItem(item, index)}
              </VirtualListItem>
            );
          })}
        </div>
      </div>
    );
  },
};


</div> -->
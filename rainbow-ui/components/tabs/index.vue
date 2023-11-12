<script>
let props = {
  value: [String, Number],
  reverse: Boolean,
  center: Boolean,
  cache: { type: Boolean, default: true },
  titleJustify: [String, Number],
  contentHeight: [String, Number],
  isMountedUpdated: { type: Boolean, default: true },
  immerse: { type: Boolean, default: false },
  activeType: { type: String, default: "shadow" }, // 'shadow' ,'none', 'underline'
};

let Content = {
  props: {
    source: [Object],
    eventName: String,
    renderName: String,
  },
  created() {
    if (this.source && this.eventName)
      this.source[this.eventName] = this.updataContent;
  },
  methods: {
    updataContent(t) {
      this.$forceUpdate();
    },
  },
  render() {
    if (this.renderName) return this.source[this.renderName]();
    return this._t("default");
  },
};

let Context = {
  inject: ["RTabs"],
  components: {
    Content,
  },
  props: {
    ...props,
  },
  data() {
    return {
      child: null,
      changeType: 0,
      pitchOnIndex: 0,
    };
  },
  created() {
    this.child = this.findChild();
    this.RTabs.child = this.child;
  },
  render() {
    let titleStyle = {
      "justify-content": this.titleJustify,
    };

    let children = this.RTabs.children;
    let this_child = this.child;

    return (
      <div class="r-tabs-context">
        <div
          class={[
            "r-tabs-header",
            this.immerse && "r-tabs-header-immerse",
            this.reverse && "r-tabs-header-reverse",
          ]}
        >
          <div ref="r-tabs-labels" class="r-tabs-labels">
            {children.map((el, index) => {
              let labelClass = [
                "r-tabs-label",
                this.immerse && "r-tabs-label-immerse",
                this_child === el && "r-tabs-label-active",
                children[index + 1] === this_child &&
                  "r-tabs-label-active-prve",
                children[index - 1] === this_child &&
                  "r-tabs-label-active-next",
              ];
              if (this_child === el) {
                return (
                  <div class={[...labelClass]}>
                    <div class="r-tabs-label-t r-tabs-label-t-active"></div>
                    <Content
                      source={el}
                      eventName="updataLabel"
                      renderName="renderLabel"
                    />
                    <div class="r-tabs-label-b r-tabs-label-b-active"></div>
                  </div>
                );
              }

              return (
                <div
                  class={labelClass}
                  onClick={() => this.tabsLableClick(el, index)}
                >
                  <div class="r-tabs-label-t r-tabs-label-t-active"></div>
                  <Content
                    source={el}
                    eventName="updataLabel"
                    renderName="renderLabel"
                  />
                  <div class="r-tabs-label-b r-tabs-label-b-active"></div>
                </div>
              );
            })}

            <Content
              source={this}
              eventName="updataActive"
              renderName="renderActive"
            />
          </div>

          <div
            class={[
              "r-tabs-labels-no",
              this.reverse && "r-tabs-labels-no-reverse",
              this.immerse && "r-tabs-labels-no-immerse",
            ]}
          >
            <div
              style={titleStyle}
              class={[
                "r-tabs-header-title",
                this.center ? "r-tabs-header-center" : "",
              ].join(" ")}
            >
              <div class="r-tabs-titles">
                {children.map((el) => {
                  let c = (() => {
                    if (el !== this_child) return "";
                    if (this.changeType < 0) return "fadeIn";
                    return "fadeIn";
                  })();
                  return (
                    <div
                      v-show={el === this_child}
                      class={"r-tabs-title animated " + c}
                    >
                      <Content
                        source={el}
                        eventName="updataTitle"
                        renderName="renderTitle"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div class="tit">
              <Content
              source={this.RTabs}
              eventName="updataTitle"
              renderName="renderTitle"
            />
            </div>
          </div>
        </div>
        <div class="r-tabs-space" v-show={!this.immerse}></div>
        <div
          class="r-tabs-contents"
          style={{
            height: this.contentHeight,
          }}
        >
          {children.map((el) => {
            let Ac = (() => {
              if (el !== this_child) return "";
              if (this.changeType < 0) return "fadeInRight";
              return "fadeInLeft";
            })();

            let Cc = (() => {
              if (
                !el.$vnode ||
                !el.$vnode.data ||
                !el.$vnode.data.staticClass
              ) {
                return "";
              }
              return el.$vnode.data.staticClass;
            })();

            if (this.cache) {
              return (
                <div
                  class={["animated r-tabs-content ", Cc, Ac]}
                  v-show={el === this_child}
                >
                  <Content
                    source={el}
                    eventName="updataContent"
                    renderName="renderContent"
                  />
                </div>
              );
            }

            return el === this_child ? (
              <div
                key={this_child.value}
                class={["animated r-tabs-content ", Cc, Ac]}
              >
                <Content
                  source={el}
                  eventName="updataContent"
                  renderName="renderContent"
                />
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  },
  mounted() {
    if (this.updataActive) this.updataActive();
    if (this.child) this.child.show();
  },
  methods: {
    renderActive() {
      if (this.activeType === "none") return null;
      if (!this.child) return null;
      if (!this.child.$refs) return null;
      if (!this.child.$refs.lable) return null;
      if (!this.$refs["r-tabs-labels"]) return null;

      let activeOffset = {};

      let pOffset = this.$refs["r-tabs-labels"].getBoundingClientRect();
      activeOffset = this.child.$refs.lable.getBoundingClientRect();
      activeOffset.left_ = activeOffset.left - pOffset.left;
      activeOffset.top_ = activeOffset.top - pOffset.top;

      let style = {
        width: `${activeOffset.width}px`,
        height: `${activeOffset.height}px`,
        left: `${activeOffset.left_}px`,
        top: `${activeOffset.top_}px`,
      };

      let activeClass = "r-tabs-labels-active-" + this.activeType;

      return (
        <div style={style} class="r-tabs-labels-active">
          <div class={activeClass}>{this._t("active")}</div>
        </div>
      );
    },

    findChild() {
      let children = this.RTabs.children;
      this.pitchOnIndex = children.findIndex((el) => el.value === this.value);
      return children.find((el) => el.value === this.value) || {};
    },

    tabsLableClick(item, index) {
      this.changeType = index - this.pitchOnIndex;
      this.child = item;
      this.pitchOnIndex = index;
      this.$emit("input", this.child.value);
      if (this.cache) this.$emit("change", item, index);
      else {
        this.$nextTick(() => {
          this.$emit("change", item, index);
        });
      }
      this.child.show();
    },
  },
};

export default {
  name: "r-tabs",
  componentName: "r-tabs",
  provide() {
    return {
      RTabs: this,
    };
  },
  props: {
    ...props,
  },

  data() {
    this.child = null;
    return {
      children: [],
    };
  },
  render() {
    return (
      <div class="r-tabs">
        {this._t("default")}
        <Context {...{ props: this.$props, on: this.$listeners }} />
      </div>
    );
  },
  updated() {
    if (this.updataTitle) this.updataTitle();
  },
  created() {},
  mounted() {},
  methods: {
    renderTitle() {
      return this._t("title");
    },
  },
  components: {
    Context,
    Content,
  },
};
</script>

<style lang="scss">
body {
  --r-tabs-border: #e4e7ed; //#e4e7ed;
  --r-tabs-header-background: #f5f7fa;
}

.r-tabs {
  background: rgb(255, 255, 255);
  box-sizing: border-box;

  .r-tabs-header-center {
    justify-content: center;
  }

  .r-tabs-header-title {
    display: flex;
    align-items: center;
    align-content: center;
    flex: 1;
  }

  .r-tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    min-height: 40px;
    line-height: 40px;
  }

  .r-tabs-header-immerse {
    border: 1px solid var(--r-tabs-border);
    border-bottom: none;
  }

  .r-tabs-header-reverse {
    flex-flow: row-reverse;
  }

  .r-tabs-labels-no-reverse {
    flex-flow: row-reverse;
  }

  .r-tabs-labels-no {
    flex: 1;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .r-tabs-labels-no-immerse {
    border-bottom: 1px solid var(--r-tabs-border);
    background: var(--r-tabs-header-background);
  }

  .tit {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  .r-tabs-labels {
    height: 100%;
    position: relative;
    display: flex;

    .r-tabs-label {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      border-bottom: 2px solid transparent;
    }

    .r-tabs-label-immerse {
      border: 1px solid transparent;
      box-sizing: border-box;
      border-bottom-color: var(--r-tabs-border);
      overflow: hidden;
      background: var(--r-tabs-header-background);

      &.r-tabs-label-active {
        border-bottom-color: transparent;
        &:last-of-type {
          border-right-color: var(--r-tabs-border);
        }
      }

      &.r-tabs-label-active-prve {
        border-right-color: var(--r-tabs-border);
        border-bottom-right-radius: 5px;
      }

      &.r-tabs-label-active-next {
        border-left-color: var(--r-tabs-border);
        border-bottom-left-radius: 5px;
      }

      &:first-of-type {
        border-left-color: transparent;
      }
    }

    .r-tabs-label-active {
      transition: 0.3s;
      color: #004c96;
      background: white;
    }

    .r-tabs-page-label {
      padding: 0 10px;
    }

    .r-tabs-labels-active {
      box-sizing: border-box;
      position: absolute;
      transition: 0.3s;
    }

    .r-tabs-labels-active-shadow {
      background: hsla(210, 100%, 29%, 0.1);
      box-shadow: 1px 0 15px 1px hsla(210, 100%, 29%, 0.3) inset;
      border-radius: 1px;
      width: 100%;
      height: 100%;
    }

    .r-tabs-labels-active-underline {
      background: #004c96;
      width: calc(100% - 15px);
      display: block;
      height: 2px;
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 2px;
    }
  }

  .r-tabs-titles {
    height: 100%;
    display: flex;
    overflow: hidden;

    .r-tabs-title {
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      animation-duration: 0.3s;
    }
  }

  .r-tabs-space {
    height: 1px;
    background-color: rgb(241, 241, 241);
  }

  .r-tabs-contents {
    max-height: calc(100vh - 40px);
    overflow: hidden;
  }

  .r-tabs-content {
    position: relative;
    overflow: auto;
    animation-duration: 0.3s;
  }

  .r-tabs-content-active {
    z-index: 10;
  }
}
</style>

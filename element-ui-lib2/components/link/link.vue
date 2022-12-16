<script>
import { renderSlot, renderScopedSlots } from "../../utils";
import { dialog } from "../../dialogs/index";

export default {
  props: {
    href: String,
    hrefs: [Array],
    target: {
      type: String,
      default: "_blank",
    },
    lineClamp: {
      type: String,
      default: "1",
    },
    simple: Boolean,
  },
  data() {
    return {
      href_: this.setHref(),
      ellipsisClass: `el-lib-link-ellipsis${this.lineClamp}`,
    };
  },
  watch: {
    href() {
      this.href_ = this.setHref();
    },
    hrefs() {
      this.href_ = this.setHref();
    },
  },
  created() {},
  methods: {
    setHref() {
      if (this.href) return this.href;
      if (this.hrefs) return this.hrefs[0];
      return "";
    },
    async copy(arg) {
      if (!navigator) {
        return this.$message.error("复制失败 当前浏览器不支持 navigator");
      }

      if (!navigator.clipboard) {
        return this.$message.error("复制失败 当前浏览器不支持 clipboard");
      }

      if (!navigator.clipboard.writeText) {
        return this.$message.error("复制失败 当前服务环境不支持复制");
      }

      await navigator.clipboard.writeText(arg);
      this.$message.success("复制成功");
    },
    copyLink() {
      if (!this.href_) return;
      this.copy(this.href_);
    },
    copyContent() {
      let textArr = this.$slots.default.map(
        (el) => el.elm.textContent || el.elm.innerText
      );
      let text = textArr.join();
      this.copy(text);
    },
    hasContent() {
      if (!this.$slots) return false;
      if (!this.$slots.default) return false;
      return true;
    },
    lookMore() {
      let vm = this;
      dialog(
        { title: "更多链接", diaAttrs: { width: "1200px" } },
        {
          renderContent() {
            return (
              <div class="linkDialog">
                {vm.hrefs.map((el) => (
                  <div class="mB15 el-lib-links">
                    <el-link
                      type="primary"
                      slot="reference"
                      class={`el-lib-link ${vm.ellipsisClass}`}
                      href={el}
                      target={vm.target}
                    >
                      {el}
                    </el-link>
                  </div>
                ))}
              </div>
            );
          },
        }
      );
    },
  },
  render() {
    // let simple

    let renderLink = this.$createElement(
      "el-link",
      {
        class: `el-lib-link ${this.ellipsisClass}`,
        slot: "reference",
        attrs: {
          type: "primary",
          ...this.$attrs,
          href: this.href_,
          target: this.target,
        },
      },
      renderSlot.call(this, "default", null, null, this.href_)
    );

    if (!this.simple) {
      return (
        <el-popover placement="top-start" trigger="hover">
          <div>
            {this.hasContent() && (
              <el-button type="text" onClick={this.copyContent}>
                复制内容
              </el-button>
            )}

            <el-button type="text" onClick={this.copyLink}>
              复制链接
            </el-button>

            {this.hrefs && this.hrefs.length > 1 && (
              <el-button type="text" onClick={this.lookMore}>
                查看更多
              </el-button>
            )}
          </div>
          {renderLink}
        </el-popover>
      );
    }

    if (this.hrefs && this.hrefs.length > 1) {
      return (
        <el-button type="text" onClick={this.lookMore}>
          查看更多
        </el-button>
      );
    }

    return renderLink;
  },
};
</script>
<style>
.linkDialog {
  max-height: 500px;
  overflow: auto;
}
.el-lib-link {
  text-align: left;
}
.el-lib-links {
  margin-bottom: 25px;
}

.el-lib-link-ellipsis1 span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

.el-lib-link-ellipsis2 span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

.el-lib-link-ellipsis3 span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

.el-lib-link-ellipsis4 span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}
</style>
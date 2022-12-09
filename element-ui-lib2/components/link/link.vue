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
  },
  data() {
    return {
      href_: this.setHref(),
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
        { title: "更多链接" },
        {
          renderContent() {
            return (
              <div class="linkDialog">
                {vm.hrefs.map((el) => (
                  <div>
                    <el-popover placement="right-end" trigger="hover">
                      <el-link slot="reference" href={el} target={this.target}>
                        {el}
                      </el-link>
                      <el-button type="text" onClick={() => vm.copy(el)}>
                        复制
                      </el-button>
                    </el-popover>
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

          {this.hrefs && (
            <el-button type="text" onClick={this.lookMore}>
              查看更多
            </el-button>
          )}
        </div>

        {this.$createElement(
          "el-link",
          {
            class: "el-lib-link",
            slot: "reference",
            attrs: {
              type: "primary",
              ...this.$attrs,
              href: this.href_,
              target: this.target,
            },
          },
          renderSlot.call(this, "default", null, null, this.href_)
        )}
      </el-popover>
    );
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
</style>
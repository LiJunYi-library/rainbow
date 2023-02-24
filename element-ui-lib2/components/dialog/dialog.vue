 <!--<template>
  <el-dialog
    :visible.sync="visible"
    v-on="{...$listeners}"
    v-bind="{
      appendToBody: true,
      size: 'mini',
      width: '50%',
      title: 'bbbbb',
      ...$attrs
    }"
  >
    <slot slot="footer" name="footer" :close="close" da="9999999999"></slot>
    <slot slot="title" name="title" :close="close" da="9999999999"></slot>
    <slot :close="close" da="9999999999"></slot>
  </el-dialog>
</template> -->

<script>
export default {
  props: {
    init: Function,
    renderDefault: Function,
    renderFooter: Function,
    renderTitle: Function,
    dataExtra: Object,
    bodyHeight: { type: String, default: "" },
    bodyStyle: Object,
  },
  inheritAttrs: false,
  data() {
    return {
      loading: false,
      visible: true,
      name: "dialog",
      ...this.dataExtra,
    };
  },
  mounted() {
    this.initmounted();
  },
  methods: {
    async initmounted() {
      if (!this.init) return;
      this.loading = true;
      await this.init(this);
      this.loading = false;
    },
    close() {
      this.visible = false;
    },
    bindProps() {
      return {
        "destroy-on-close": true,
        "custom-class": "el-lib-dialog",
        size: "mini",
        width: "50%",
        top: "0",
        title: "",
        visible: this.visible,
        ...this.$attrs,
        appendToBody: true,
      };
    },
    bindOn() {
      return {
        "update:visible": (a) => (this.visible = a),
        ...this.$listeners,
        onClosed: () => {
          this.$el.remove();
          this.$emit("closed", this);
        },
      };
    },
    bindScopedSlotsDefault() {
      let _SS = this.$scopedSlots;
      if (this.renderDefault) return this.renderDefault(this);
      if (_SS.default) return _SS.default(this);
      return null;
    },
    bindScopedSlotsTitle() {
      let _SS = this.$scopedSlots;
      if (this.renderTitle) return this.renderTitle(this);
      if (_SS.title) return _SS.title(this);
      return null;
    },
    bindScopedSlotsFooter() {
      let _SS = this.$scopedSlots;
      if (this.renderFooter) return this.renderFooter(this);
      if (_SS.footer) return _SS.footer(this);
      return null;
    },
  },
  render(h) {
    this.h = h;
    return this.$createElement(
      "el-dialog",
      {
        ref: "elDialog",
        class: "el-lib-dialog-wrapper",
        props: this.bindProps(),
        on: this.bindOn(),
        scopedSlots: {
          default: () => (
            <div
              style={{ height: this.bodyHeight, ...this.bodyStyle }}
              ref="el-lib-dialog-body"
              class="el-lib-dialog-body"
              v-loading={this.loading}
            >
              {this.bindScopedSlotsDefault()}
            </div>
          ),
          title: this.bindScopedSlotsTitle,
        },
      },
      [<template slot="footer">{this.bindScopedSlotsFooter()}</template>]
    );
  },
};
</script>

<style >
.el-dialog.el-lib-dialog {
  max-height: 100vh;
  margin: 0 auto;
} 
.el-lib-dialog-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-lib-dialog .el-dialog__body {
  overflow: auto;
  position: relative;
  padding: 0;
}

.el-lib-dialog .el-lib-dialog-body {
  overflow: auto;
  position: relative;
  padding: 0;
}
</style>
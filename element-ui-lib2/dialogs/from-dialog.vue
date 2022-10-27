<script >
export default {
  props: {},
  data() {
    return {
      resolve: null,
      reject: null,
      visible: true,
      loading: false,
      cancelText: "",
      title: "提 交bd",
      confirmText: "提 交",

      fromData: {},
      rules: null,
      fromItems: {},
    };
  },
  watch: {},
  mounted() {
    /** */
  },
  methods: {
    closed() {
      this.$el.remove();
    },
    renderContent() {
      return <div>快速表单提交</div>;
    },
    renderfromItems() {
      let formItemsNode = [];
      let h = this.$createElement;

      for (const key in this.fromItems) {
        if (Object.hasOwnProperty.call(this.fromItems, key)) {
          const ele = this.fromItems[key];

          // if (ele.value !== undefined) this.$set(this.fromData, key, ele.value);

          const formItem = { ...ele };

          const formItem_child = ele.child || {};

          delete formItem.child;

          formItemsNode.push(
            h(
              "el-form-item",
              {
                attrs: {
                  label: key,
                  prop: key,
                  ...formItem,
                },
              },
              [this.renderfromItemChild(formItem, key, formItem_child)]
            )
          );
          ///////////////
        }
      }

      return formItemsNode;
    },
    renderfromItemChild(formItem, key, child) {
      // console.log("child", child);
      // console.log("child", child instanceof Function);
      if (child instanceof Function) return child(this.fromData, formItem, key);
      return <el-input v-model={this.fromData[key]}></el-input>;
    },
    hiddle() {
      this.visible = false;
    },
    confirm() {
      //
    },
    onErrorSubmit() {
      console.log("error submit!!");
    },

    async onSubmit() {
      alert("submit!");
    },

    async confirmClick() {
      if (this.loading) return;
      await this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let res = await this.onSubmit(this);
          this.loading = false;
          if (res) {
            if (this.resolve) this.resolve(this);
            this.hiddle();
          }
        } else {
          this.onErrorSubmit(this);
          return false;
        }
      });
    },

    renderStart() {
      return null;
    },

    renderEnd() {
      return null;
    },

    renderDefaultSlot() {
      let attrs = {
        model: this.fromData,
      };
      if (this.rules) attrs.rules = this.rules;
      return (
        <div class="fromContent" v-loading={this.loading}>
          {this.$createElement(
            "el-form",
            {
              ref: "ruleForm",
              attrs,
            },
            [
              <div class="from-item-s">
                {this.renderStart(this)}
                {this.renderfromItems(this)}
                {this.renderContent(this)}
                {this.renderEnd(this)}
              </div>,
            ]
          )}
        </div>
      );
    },

    renderFooterSlot() {
      return (
        <div slot="footer" class="dialog-from-footer">
          {this.cancelText && (
            <el-button onClick={() => this.hiddle()}>
              {this.cancelText}
            </el-button>
          )}
          {this.confirmText && (
            <el-button
              type="primary"
              onClick={() => this.confirmClick()}
              loading={this.loading}
            >
              {this.confirmText}
            </el-button>
          )}
        </div>
      );
    },
  },
  render() {
    return this.$createElement(
      "el-dialog",
      {
        attrs: {
          "append-to-body": true,
          title: this.title,
          visible: this.visible,
          width: "500px",
          top: "0px",
          "custom-class": "mmb-log",
          ...this.$attrs,
        },
        class: "mmb-log-wrapper",
        on: {
          closed: () => this.closed(),
          "update:visible": (a) => (this.visible = a),
        },
        scopedSlots: {
          default: (...arg) => {
            return [this.renderDefaultSlot()];
          },
        },
      },
      [this.renderFooterSlot()]
    );
  },
};
</script>
<style>
.mmb-log-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mmb-log {
  margin: 0;
}
.dialog-from-footer {
  display: flex;
  justify-content: end;
}
</style>
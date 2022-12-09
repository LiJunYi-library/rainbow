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
      diaAttrs: {},
      diaOn: {},
      diaClass: "",
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
      return <div></div>;
    },
    hiddle() {
      this.visible = false;
    },
    confirm() {},
    onErrorSubmit() {},
    async onSubmit() {},
    async confirmClick() {},
    renderStart() {
      return null;
    },
    renderEnd() {
      return null;
    },

    renderDefaultSlot() {
      return this.renderContent(this);
    },

    renderFooterSlot() {
      return null;
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
          ...this.diaAttrs,
          ...this.$attrs,
        },
        class: "mmb-log-wrapper " + this.diaClass,
        on: {
          closed: () => this.closed(),
          "update:visible": (a) => (this.visible = a),
          ...this.diaOn,
        },
        scopedSlots: {
          default: (...arg) => {
            return (
              <div class="el-lib-dialog-body" ref="el-lib-dialog-body">
                {this.renderDefaultSlot()}
              </div>
            );
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
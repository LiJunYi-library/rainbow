<script>
import DIALOG from "./dialog-base.vue";
import form from "../from/form.vue";
export default {
  extends: DIALOG,
  props: {
    dataFrom: Object,
    submit: Function,
    cancel: {
      type: Function,
      default(vm) {
        vm.close();
      },
    },
    align: String,
    cancelText: { type: String, default: "" },
    confirmText: { type: String, default: "提 交" },
  },
  data() {
    return {
      name: "from-dialog",
      fromData: this.dataFrom || {},
    };
  },
  methods: {
    async submitForm() {
      // console.log("submitForm", this.$refs["ruleForm"]);
      await this.$refs["ruleForm"].validate();
      // console.log("validate");
      this.loading = true;
      if (this.submit) await this.submit(this);
      this.loading = false;
    },
    async cancelForm() {
      this.loading = true;
      await this.cancel(this);
      this.loading = false;
    },
    renderDefaultFooter(){
      return (
        <div v-loading={this.loading} style={`text-align: ${this.align};`}>
          {this.cancelText && (
            <el-button size="mini" onClick={this.cancelForm}>
              {this.cancelText}
            </el-button>
          )}
          {this.confirmText && (
            <el-button
              type="primary"
              size="mini"
              loading={this.loading}
              onClick={this.submitForm}
            >
              {this.confirmText}
            </el-button>
          )}
        </div>
      );
    },
    bindScopedSlotsFooter() {
      let _SS = this.$scopedSlots;
      if (this.renderFooter) return this.renderFooter(this);
      if (_SS.footer) return _SS.footer(this);
      return this.renderDefaultFooter()
    },
    bindScopedSlotsDefault() {
      let _SS = this.$scopedSlots;
      // console.log("bindScopedSlotsDefault", this);
      return this.$createElement(form, {
        ref: "ruleForm",
        style: {
          padding: "10px 15px",
        },
        attrs: {
          ...this.$attrs,
          model: this.fromData,
        },
        on: {
          ...this.$listeners,
        },
        scopedSlots: {
          default: () => {
            if (this.renderDefault) return this.renderDefault(this);
            if (_SS.default) return _SS.default(this);
            return null;
          },
        },
      });
    },
  },
};
</script>
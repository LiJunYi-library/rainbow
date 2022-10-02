<script>
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";
import { QueuePromise } from "@rainbow_ljy/jsapi";
import fetchOptions from "../../mixins/fetchOptions.js";

export default {
  mixins: [fetchOptions],
  emits: ["update:formData", "update:visible", "verify", "noPassVerify"],
  props: {
    formData: { type: Object, default: () => ({}) },
    formRules: { type: Object, default: () => ({}) },
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      _formData: this.formData,
      _visible: this.visible,
    };
  },
  watch: {
    formData(newV) {
      this._formData = newV;
    },
    visible() {
      this._visible = this.visible;
    },
  },
  render() {
    const el_dialog = resolveComponent("el-dialog");
    const el_form = resolveComponent("el-form");
    let dialogAttrs = this.$attrs;
    return (
      <el-dialog
        {...dialogAttrs}
        v-model={this._visible}
        onClosed={() => this.onClosed()}
      >
        {{
          header: (...arg) => this.renderDiaHeader(...arg),
          default: (...arg) => this.renderDiaDefault(...arg),
        }}
      </el-dialog>
    );
  },
  methods: {
    renderDiaDefault() {
      return (
        <div v-loading={this.loading_}>
          <el-form
            label-width="120px"
            model={this._formData}
            ref="elForm"
            rules={this.formRules}
          >
            {this.renderDefault()}
          </el-form>
          <div class="form-dialog-footer">
            <el-button onClick={() => this.cancel()}>取消</el-button>
            <el-button onClick={() => this.confirm()}>提交</el-button>
          </div>
        </div>
      );
    },
    renderDefault() {
      if (this.$slots.default) return this.$slots.default();
      return null;
    },
    renderDiaHeader(...arg) {
      if (this.$slots.header) return this.$slots.header(...arg);
      return null;
    },
    cancel() {
      console.log("取消");
      this.$emit("update:visible", false);
    },
    async confirm() {
      await this.$refs.elForm.validate((valid, fields) => {
        if (valid) {
          console.log("提交!");
          this.verify();
          this.$emit("verify");
        } else {
          console.log("error 提交!", fields);
          this.$emit("noPassVerify");
        }
      });
    },
    onClosed() {
      this.$emit("update:visible", false);
      if (!this.$refs.elForm) return;
      this.$refs.elForm.resetFields();
    },
    async verify() {
      this.callFetchData();
    },
    beforeFetch() {},
    afterFetch() {},
  },
};
</script>
<style>
.form-dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
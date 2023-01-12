<script>
import { renderSlot, renderScopedSlots } from "../../utils";
import base from "../../mixins/base";
export default {
  provide() {
    return {
      elLibForm: this,
    };
  },
  mixins: [base],
  props: {
    submit: Function,
    reset: Function,
    showErrorMessage: { type: Boolean, default: true },
    "margin-bottom": String,
  },
  render() {
    return this.$createElement("el-form", {
      ref: "el-form",
      attrs: {
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
      },
      scopedSlots: {
        default: renderScopedSlots.call(this, "default", this.renderDefault),
      },
    });
  },
  mounted() {
    //
  },
  created() {
    this.setSubmit();
  },
  beforeDestroy() {
    //
  },
  methods: {
    errorMessage(unPass) {
      if (!this.showErrorMessage) return;
      let content = [];
      for (const key in unPass) {
        if (Object.hasOwnProperty.call(unPass, key)) {
          const element = unPass[key][0] || {};
          content.push(<div>{element.message}</div>);
        }
      }
      this.$message({
        message: this.$createElement("div", { style: "color:red" }, content),
        type: "error",
      });
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["el-form"].validate((valid, unPass) => {
          if (valid) resolve({ valid, unPass });
          else {
            this.errorMessage(unPass);
            this.$emit("onErrorSubmit", unPass, this);
            reject({ valid, unPass });
          }
        });
      });
    },
    resetFields() {
      this.$refs["el-form"].resetFields();
    },
    setSubmit() {
      if (!this.submit) return;
      this.submit.onApply = () => {
        this.$refs["el-form"].validate((valid, unPass) => {
          // console.log(unPass);
          if (valid) {
            // console.log("success submit!!");
            this.submit.lock = false;
          } else {
            // console.log("error submit!!");
            this.submit.lock = true;
            this.errorMessage(unPass);
            this.$emit("onErrorSubmit", unPass, this);
            return false;
          }
        });
      };
    },
    setReset() {
      if (!this.reset) return;
      this.submit.onApply = () => {
        this.$refs["el-form"].resetFields();
      };
    },
    renderDefault() {
      return null;
    },
  },
};
</script>
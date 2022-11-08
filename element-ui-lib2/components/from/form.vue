<script>
import { renderSlot, renderScopedSlots } from "../../utils";
import base from "../../mixins/base";
export default {
  mixins: [base],
  props: {
    submit: Function,
    reset: Function,
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
    setSubmit() {
      if (!this.submit) return;
      this.submit.onApply = () => {
        this.$refs["el-form"].validate((valid) => {
          if (valid) {
            // console.log("success submit!!");
            this.submit.lock = false;
          } else {
            // console.log("error submit!!");
            this.submit.lock = true;
            this.$emit("onErrorSubmit", this);
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
<script>
import { renderSlot, renderScopedSlots } from "../../utils";
import base from "../../mixins/base";
export default {
  inject: {
    elLibForm: { default: () => ({}) },
  },
  mixins: [base],
  props: {
    required: Boolean,
    requiredMessage: {
      type: String,
      default() {
        return "请输入" + this.$attrs.label;
      },
    },
    requiredTrigger: {
      type: String,
      default: "blur",
    },
    regulation: {
      type: Array,
      default: () => [],
    },
    regExpTrigger: {
      type: String,
      default: "blur",
    },
    regExpMessage: {
      type: String,
      default() {
        return this.$attrs.label + "有误";
      },
    },
    validatorTrigger: {
      type: String,
      default: "blur",
    },
    validator: Function,
    regExp: RegExp,
    "margin-bottom": String,
    unit: String,
  },
  render() {
    return this.$createElement("el-form-item", {
      style: {
        marginBottom: this.marginBottom || this.elLibForm.marginBottom,
      },
      attrs: {
        ...this.bindRules(),
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
        label: this.$attrs.label,
      },
      scopedSlots: {
        default: renderScopedSlots.call(this, "default", this.renderDefault),
        label: renderScopedSlots.call(this, "label", () => (
          <span>
            {" "}
            {[this.$attrs.label, this.unit].filter(Boolean).join("")}
          </span>
        )),
      },
    });
  },
  methods: {
    message(m) {
      if (m instanceof Function) return m();
      return m;
    },
    bindRules() {
      let requiredRule = {
        required: this.required,
        message: this.message(this.requiredMessage),
        trigger: this.requiredTrigger,
      };

      let regExpRule = {
        trigger: this.regExpTrigger,
        validator: (rule, value, callback) => {
          let message = this.message(this.regExpMessage);
          if (this.regExp.test(value)) return callback(new Error(message));
          callback();
        },
      };

      let validatorRule = {
        trigger: this.validatorTrigger,
        validator: (rule, value, callback) =>
          this.validator(rule, value, callback),
      };

      return {
        rules: [
          this.required && requiredRule,
          this.regExp && regExpRule,
          this.validator && validatorRule,
          ...this.regulation,
        ].filter(Boolean),
      };
    },
    renderDefault() {
      return null;
    },
  },
};
</script>

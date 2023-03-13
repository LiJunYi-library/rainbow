<script>
import base from "../../mixins/base";
export default {
  mixins: [base],
  methods: {
    bindDefaultAttrs() {
      return {};
    },
    bindDefaultEvents() {
      return {};
    },
    keyCodeEvene(event) {
      if (event.code === "NumpadEnter" || event.code === "Enter")
        this.$emit("enter");
    },
  },
  created() {
    window.addEventListener("keyup", this.keyCodeEvene);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyCodeEvene);
  },
  render() {
    return this.$createElement(
      "el-button",
      {
        attrs: {
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
        },
        on: {
          ...this.bindDefaultEvents(),
          ...this.$listeners,
        },
        ...this.bindDefaultProperty(),
      },
      this.$slots.default
    );
  },
};
</script>
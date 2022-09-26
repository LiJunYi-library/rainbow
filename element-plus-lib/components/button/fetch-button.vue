<script>
import fetchOptions from "../../mixins/fetchOptions.js";
import { h, createVNode, resolveComponent, withDirectives } from "vue";
import { objectFilter } from "../../utils/obj";

export default {
  mixins: [fetchOptions],

  render(_ctx, _cache, $props, $setup, $data, $options) {
    const el_button = resolveComponent("el-button");

    return h(
      el_button,
      {
        loading: this.loading_,
        ...this.$attrs,
      },
      {
        default: (...arg) => this.renderSlotsDefault(...arg),
      }
    );
  },

  methods: {
    renderSlotsDefault(...arg) {
      if (!this.$slots.default) return null;
      return this.$slots.default(...arg);
    },
  },
};
</script>
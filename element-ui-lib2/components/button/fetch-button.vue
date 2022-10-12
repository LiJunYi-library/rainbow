<script>
import Button from "./button.vue";
import fetchOptions from "../../mixins/fetchOptions";

export default {
  extends: Button,
  mixins: [fetchOptions],
  methods: {
    bindDefaultAttrs() {
      return {
        loading: this.loading_,
      };
    },
  },
};
</script>

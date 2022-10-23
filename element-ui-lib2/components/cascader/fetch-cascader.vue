<script>
import Cascader from "./cascader.vue";
import fetchOptions from "../../mixins/fetchOptions";

export default {
  extends: Cascader,
  mixins: [fetchOptions],
  methods: {
    bindDefaultAttrs() {
      return {
        loading: this.loading_,
        options: this.responseData_ || [],
      };
    },
  },
};
</script>
<script>
import SelectList from "./select-list.vue";
import fetchOptions from "../../mixins/fetchOptions";

export default {
  extends: SelectList,
  mixins: [fetchOptions],
  methods: {
    bindDefaultAttrs() {
      return {
        loading: this.loading_,
      };
    },
    afterFetch() {
      this.data_ = this.responseData_;
      this.emitInput(this.value);
    },
  },
};
</script>
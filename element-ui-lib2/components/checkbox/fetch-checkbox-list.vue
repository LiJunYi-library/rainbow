<script>
import checkboxList from "./checkbox-list.vue";
import fetchOptions from "../../mixins/fetchOptions.js";
export default {
  extends: checkboxList,
  mixins: [fetchOptions],
  methods: {
    bindLoading() {
      return this.loading_;
    },

    afterFetch() {
      this.data_ = this.responseData_;
      this.handleState();
    },
  },
};
</script>


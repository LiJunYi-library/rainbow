<script>
import SelectListTree from "./select-list-tree.vue";
import fetchOptions from "../../mixins/fetchOptions";

export default {
  extends: SelectListTree,
  mixins: [fetchOptions],
  props: {
    lazyLoad: Boolean,
  },
  methods: {
    bindDefaultAttrs() {
      return {
        loading: this.loading_,
      };
    },
    afterFetch() {
      this.data_ = this.responseData_;
    },
    afterUpdateInput(value) {
      if (!this.lazyLoad) return;
      if (!this.child) return;
      if (!this.child.callFetchData) return;
      if (!value) return;
      this.child.callFetchData();
    },
  },
};
</script>
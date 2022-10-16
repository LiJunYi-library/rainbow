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

    async setData(current) {
      if (!this.lazyLoad) return;
      if (!this.callFetchData) return;
      // console.log("Fetch  setData ******** " + this.layer, this.value);
      let res = await this.callFetchData();
      // console.log("Fetch  setData **** " + this.layer);
      return res;
    },
  },
};
</script>
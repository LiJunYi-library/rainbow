<template>
  <div v-loading="loading_">
    <div>{{ responseData_ }}</div>
    <slot />
  </div>
</template>
<script>
import fetchOptions from "../../mixins/fetchOptions.js";

export default {
  mixins: [fetchOptions],
  created() {},
};
</script>
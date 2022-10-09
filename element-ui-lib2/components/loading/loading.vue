<template>
  <div v-loading="loading_">
    <slot />
  </div>
</template>
<script>
import fetchOptions from "../../mixins/fetchOptions";

export default {
  mixins: [fetchOptions],
};
</script>

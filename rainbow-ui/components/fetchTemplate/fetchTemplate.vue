<template>
  <div v-loading="loading_">
    <slot :data="responseData_" />
  </div>
</template>
<script>
import fetchOptions from '../../mixins/fetchOptions';

export default {
  mixins: [fetchOptions],
  created() {},
};
</script>

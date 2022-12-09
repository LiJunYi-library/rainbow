<template>
  <div class="el-lib-join" :style="`max-height:${maxHeight}`">
    <span v-for="(item, index) in (data_ || [])" :key="index">
      <span class="symbol" v-if="index">{{ symbol }}</span>
      <slot :item="item">
        <span>{{ item }}</span>
      </slot>
    </span>
    <!-- <div style="height: 10px"></div> -->
  </div>
</template>

<script>
import dataOptions from "../../mixins/dataOptions";
import base from "../../mixins/base";
export default {
  mixins: [dataOptions, base],
  props: {
    maxHeight: {
      type: String,
      default: "50px",
    },
    filter: {
      type: Function,
      default: () => Boolean,
    },
    symbol: {
      type: String,
      default: "、",
    },
  },
};
</script>

<style lang="scss" >
.el-lib-join {
  display: inline-block;
  overflow: auto;
}
</style>
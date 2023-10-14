<template>
  <el-button
    v-bind="{
      size: 'mini',
      type: 'primary',
      ...this.$attrs,
    }"
    style="cursor: pointer"
    v-on="{
      ...this.$listeners,
      click: onAsyncClick,
    }"
  >
    <template v-if="!loading">
      <slot name="icon">
        <i v-if="iconClass" :class="iconClass"></i>
      </slot>
    </template>
    <i v-if="loading_" class="el-icon-loading"></i>
    <slot></slot>
  </el-button>
</template>

<script>
import AsyncEvent from '../../mixins/asyncEvent';

export default {
  mixins: [AsyncEvent],
  props: {
    iconClass: {type: String, default: ''},
  },

  mounted() {},
  methods: {
    // verifyClick() {
    //     this.$message.error('无权限');
    //     return false
    // }
  },
};
</script>

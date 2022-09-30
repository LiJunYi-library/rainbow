<template>
  <el-dialog
    append-to-body
    width="800px"
    @close="visible = false"
    v-model="visible"
    @closed="closed"
  >
    999999999999999999999999
  </el-dialog>
</template>

<script lang="ts">
export default {
  data() {
    return {
      visible: false,
      img: "",
      title: "",
      table: [],
    };
  },
  methods: {
    closed() {
      this?.resolve?.(false);
    },
  },
};
</script>
<style>
.mmb-log-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mmb-log {
  margin: 0;
}
.mmb-log .el-dialog__body {
  max-height: 600px;
  overflow: auto;
}
</style>


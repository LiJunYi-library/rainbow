<template>
  <div>
    <el-dialog
      append-to-body
      width="800px"
      @close="visible = false"
      v-model="visible"
      @closed="closed"
    >
      <div>999999999999999999999999</div>
      <div><el-button>点击</el-button></div>
    </el-dialog>
  </div>
</template>

<script >
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


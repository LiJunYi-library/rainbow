export default {
  props: {
    data: [Array, Object]
  },
  data() {
    return {
      data_: this.data
    }
  },
  watch: {
    data() {
      this.data_ = this.data
    }
  },
};
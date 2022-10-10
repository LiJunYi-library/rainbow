<script>
export default {
  provide() {
    return {
      RRadio: this,
    };
  },
  inject: {
    RRadioGroup: {
      default: () => ({}),
    },
  },
  created() {
    let index = [].includes(this )
    // console.log(">>>>>>>", this.RRadioGroup);
  },
  beforeDestroy(){

  },
  render() {
    return <div class="r-radio">r-radio</div>;
  },
};
</script>
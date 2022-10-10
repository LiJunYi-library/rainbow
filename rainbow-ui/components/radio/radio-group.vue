<script>
export default {
  provide() {
    return {
      RRadioGroup: this,
    };
  },
  data() {
    return {
      children: [],
    };
  },
  render() {
    console.log(this);
    return <div class="r-radio-group">{this.renderSlotDefault()}</div>;
  },
  methods: {
    renderSlotDefault() {
      if (this.$slots.default) return this.$slots.default;
      return null;
    },
  },
};
</script>
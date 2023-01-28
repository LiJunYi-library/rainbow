<script>
export default {
  render() {
    return (
      <div class="r-virtual-list-falls-header">
        {renderSlot.call(this, "default")}
      </div>
    );
  },
  mounted() {
    let offset = this.$el.getBoundingClientRect();
    this.$parent.headerHeight = offset.height;
  },
};
</script>
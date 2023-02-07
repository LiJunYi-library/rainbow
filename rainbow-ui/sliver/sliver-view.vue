<script>
export default {
  created() {
    // console.log("created", this.$parent);
    this.$parent.slivers.push(this);
  },
  beforeUpdate() {
    this.$parent.slivers.remove(this);
    // console.log(this.index, "beforeUpdate  VirtualListItem", this.$el);
  },
};
</script>
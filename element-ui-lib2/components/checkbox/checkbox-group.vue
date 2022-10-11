<script>
export default {
  provide() {
    return {
      checkboxGroup: this,
    };
  },
  props: {
    value: Array,
  },
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    bindLoading() {
      return false;
    },
    bindDefaultAttrs() {
      return {};
    },
    renderDefaultSlot() {
      if (this.$scopedSlots.default) {
        return (props) => {
          return this.$scopedSlots.default(props);
        };
      }
      return (props) => this.renderDefault(props);
    },

    renderDefault(props) {
      return null;
    },

    renderAllCheckbox() {
      return null;
    },

    renderGroup() {
      let vm = this;
      return this.$createElement("el-checkbox-group", {
        attrs: {
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
          value: this.value,
        },
        on: {
          ...this.$listeners,
          input: (value) => {
            vm.$emit("input", value);
          },
        },
        scopedSlots: {
          default: this.renderDefaultSlot(),
        },
      });
    },
  },
  render() {
    let loading = false;
    if (this.bindLoading) loading = this.bindLoading();
    return (
      <div class="el-checkbox-list" v-loading={loading}>
        {this.renderAllCheckbox()}
        {this.renderGroup()}
      </div>
    );
  },
};
</script>
<style>
.el-checkbox-list {
  display: flex;
}
.el-checkbox-list .title {
  padding-top: 8px;
  padding-right: 10px;
}
.el-checkbox-list .checkbox {
  flex: 1;
  display: flex;
}
.el-checkbox-list .all {
  padding-right: 10px;
}
.el-checkbox-list .groups {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
</style>


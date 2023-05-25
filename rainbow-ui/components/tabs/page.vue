<script>
export default {
  inject: ['RTabs'],
  render() {
    return null;
  },
  data() {
    this.isRender = false;
    this.isMounted = false;
    return {};
  },
  props: {
    value: {required: true, type: [Number, String]},
    lable: [String, Number],
  },
  beforeCreate() {},
  created() {
    if (!this.RTabs) return;
    this.RTabs.children.push(this);
  },
  updated() {
    this.RTabs.$emit('tabs-page-update');
    if (this.updataTitle) this.updataTitle();
    if (this.updataLabel) this.updataLabel();
    if (this.updataContent) this.updataContent();
  },
  mounted() {
    this.isMounted = true;
  },
  beforeDestroy() {
    if (!this.RTabs) return;
    this.RTabs.children = this.RTabs.children.filter(el => el !== this);
  },
  methods: {
    show() {
      this.$nextTick(() => {
        this.$emit('show');
      });
    },
    renderTitle() {
      return this._t('title');
    },
    renderLabel() {
      return (
        <div ref="lable" class="r-tabs-page-label">
          {this._t('lable', this.lable)}
        </div>
      );
    },
    renderContent() {
      return this._t('default');
    },
  },
};
</script>

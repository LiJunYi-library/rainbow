<template>
  <div class="rainbow-sticky" ref="box">
    <div ref="sticky" class="sticky">
      <slot />
      <div v-if="collapse && isSticky" class="collapse" @click="showAll">
        👇
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    scrollContainer: {
      type: [Object, HTMLElement, HTMLDocument],
      default: () => document.body,
    },
    collapse: Boolean,
    top: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      path: [],
      initData: {
        offsetTop: 0,
        clientTop: 0,
        scrollTop: 0,
      },
      fold: true,
      isSticky: false,
      layoutTop: 0,
    };
  },
  methods: {
    onScroll(event) {
      const { target } = event;
      if (!this.path.includes(target)) return;
      const { scrollTop } = target;
      this.layoutTop = target.getBoundingClientRect().top;
      const stickyTop = this.initData.offsetTop - scrollTop;
      this.$emit("onScroll", { scrollTop, stickyTop, vm: this });
      if (stickyTop <= this.top && !this.isSticky) {
        this.isSticky = true;
        this.$refs.sticky.style.position = "fixed";
        this.$refs.sticky.style.zIndex = 98;
        this.$refs.sticky.style.top = `${this.top + this.layoutTop}px`;
        this.$refs.sticky.style.width = `${this.initData.offsetWidth}px`;
        this.$refs.box.style.width = `${this.initData.offsetWidth}px`;
        this.$refs.box.style.height = `${this.initData.offsetHeight}px`;
        this.handleCollapse();
        this.$emit("onChange", this.isSticky);
        this.$emit("onSticky", this.isSticky);
      }

      if (stickyTop > this.top && this.isSticky) {
        this.isSticky = false;
        this.$refs.sticky.style.position = "";
        this.$refs.sticky.style.zIndex = "";
        this.$refs.sticky.style.top = "";
        this.$refs.sticky.style.width = "";
        this.$refs.sticky.style.height = "";
        this.$refs.sticky.style.overflow = "";
        this.$refs.box.style.width = "";
        this.$refs.box.style.height = "";
        this.$emit("onChange", this.isSticky);
        this.$emit("unSticky", this.isSticky);
      }
    },
    showAll() {
      this.fold = !this.fold;
      if (this.fold) this.$refs.sticky.style.height = `15px`;
      else this.$refs.sticky.style.height = `${this.initData.offsetHeight}px`;
    },
    handleCollapse() {
      if (!this.collapse) return;
      this.$refs.sticky.style.height = "15px";
      this.$refs.sticky.style.overflow = "hidden";
    },
    getPath(node) {
      this.path.push(node);
      if (node.parentNode) this.getPath(node.parentNode);
    },
    init() {
      const { offsetTop, clientTop, offsetHeight, offsetWidth } = this.$el;
      if (this.collapse) offsetHeight = offsetHeight + 15;
      this.initData = {
        clientTop,
        offsetTop,
        offsetHeight,
        offsetWidth,
        offsetBottom: offsetTop + offsetHeight,
      };
    },
  },
  mounted() {
    this.getPath(this.$el);
    this.init();
  },
  created() {
    this.scrollContainer.addEventListener("scroll", this.onScroll, true);
  },
  beforeUnmount() {
    this.scrollContainer.removeEventListener("scroll", this.onScroll, true);
  },
  unmounted() {
    this.scrollContainer.removeEventListener("scroll", this.onScroll, true);
  },
  beforeDestroy() {
    this.scrollContainer.removeEventListener("scroll", this.onScroll, true);
  },
  destroyed() {
    this.scrollContainer.removeEventListener("scroll", this.onScroll, true);
  },
};
</script>
<style >
.rainbow-sticky {
  position: relative;
}
.rainbow-sticky .sticky {
  transition: 0.3s;
}
.rainbow-sticky .collapse {
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: center;
  width: 100%;
}
</style>

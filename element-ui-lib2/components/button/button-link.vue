<script>
import Button from "./button.vue";
export default {
  extends: Button,
  props: {
    href: String,
    id: [String, Number],
    path: String,
    type: String,
    fill: Boolean,
    query: {
      type: [Object, Function],
      default: () => ({}),
    },
    plain: Boolean,
    silent: Boolean,
    /**
     * 1.target="_self"
      内容在当前页面显示。
      2.target="_blank"
      内容在新页面显示。
      3.target=“three”
      内容在对应窗口显示
      4.target="_top"
      在当前窗体打开链接，并替换当前的整个窗体(框架页)，清除所有包含的框架
      5.target="_parent"
      在父窗体中打开链接，在窗口与顶级框架中，等同于_self
     */
    target: {
      type: String,
      default: "_blank",
    },
  },
  computed: {
    query_() {
      let _query = this.query;
      if (this.query instanceof Function) _query = this.query();
      return { id: this.id, ..._query };
    },
    link_() {
      if (this.href) return this.href;
      if (this.path) {
        const task = this.$router.resolve({
          path: this.path,
          query: { id: this.id },
        });
        return task.href;
      }
      return "";
    },
    href_() {
      if (this.href) return this.href;
      if (this.path) {
        const task = this.$router.resolve({
          path: this.path,
          query: this.query_,
        });
        return task.href;
      }
      return "";
    },
    history() {
      let data = window.localStorage.getItem("history") || "[]";
      let history = JSON.parse(data);
      return history;
    },
  },
  methods: {
    getHistory() {
      let data = window.localStorage.getItem("history") || "[]";
      let history = JSON.parse(data);
      return history;
    },
    setHistory(href) {
      let history = this.getHistory();
      history.unshift(href);
      window.localStorage.setItem("history", JSON.stringify(history));
    },
    onClick() {
      this.setHistory(this.link_);
      this.$forceUpdate();
      if (this.target === "_self" && this.path) {
        this.$router.push({
          path: this.path,
          query: this.query_,
        });
        return;
      }
      window.open(this.href_, this.target);
    },
    bindDefaultEvents() {
      return {
        click: this.onClick,
      };
    },
    bindDefaultAttrs() {
      let history = this.getHistory();
      let plain = history.includes(this.link_);
      return {
        // type: plain ? "info" : "primary",
        type: "primary",
        size: "mini",
        plain: !plain,
      };
    },
  },
};
</script>
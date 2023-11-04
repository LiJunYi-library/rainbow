<script>
import { setConfig } from "../../mixins/setConfig";

export default {
  render() {
    return null;
  },
  name: "rbEchart_series",
  componentName: "rbEchart_series",
  provide() {
    return {
      rbEchart_series: this,
    };
  },
  data() {
    return {
      config: {},
    };
  },
  inject: ["rbEchart"],
  props: {
    name: { type: String, default: "请设置名字" },
    type: { type: String, default: "bar" },
    data: { type: [Array], default: () => [] },
    itemStyle: { type: Object, default: () => ({}) },
    label: { type: Object, default: () => ({}) },
    barMaxWidth: { type: String, default: "30" },
    barGap: { type: String, default: "100%" },
  },
  methods: {
    setConfig() {
      setConfig.call(this);
    },

    handleEchart() {
      if (!this.rbEchart) return;
      if (!this.rbEchart.config) return;
      if (!this.rbEchart.config.series) return;
      this.rbEchart.config.series.push(this.config);
    },

    remove() {
      if (!this.rbEchart) return;
      if (!this.rbEchart.config) return;
      if (!this.rbEchart.config.series) return;
      const index = this.rbEchart.config.series.findIndex((ele) => {
        return ele === this.config;
      });
      if (index !== -1) this.rbEchart.config.series.splice(index, 1);
    },
  },
  watch: {
    data(newV) {
      this.config.data = newV;
      this.setConfig();
      this.rbEchart.updateEchart();
    },
  },

  created() {
    this.setConfig();
    this.handleEchart();
  },

  unmounted() {
    this.remove();
  },

  destroyed() {
    this.remove();
  },
};
// export default class Echart_series extends Vue {
//   mmbEchart: any;
//   config: any = {};
//   declare $props: any;

// setConfig(): void {
//   setConfig.call(this);
// }

// handleMmbEchart(): void {
//   if (!this.mmbEchart?.config?.series ?? undefined) return;
//   this.mmbEchart.config.series.push(this.config);
// }

// remove(): void {
//   if (!this.mmbEchart?.config?.series ?? undefined) return;
//   let index = this.mmbEchart.config.series.findIndex((ele: any) => {
//     return ele === this.config;
//   });
//   if (index !== -1) this.mmbEchart.config.series.splice(index, 1);
// }

//   unmounted(): void {
//     this.remove();
//   }

//   created(): void {
//     this.setConfig();
//     this.handleMmbEchart();
//   }
// }
</script>

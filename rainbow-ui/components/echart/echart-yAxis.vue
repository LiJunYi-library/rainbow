<script>
import { setConfig } from "../../mixins/setConfig";

export default {
  // functional: true,
  render() {
    return null;
  },
  name: "rbEchart_yAxis",
  componentName: "rbEchart_yAxis",
  provide() {
    return {
      rbEchart_yAxis: this,
    };
  },
  inject: ["rbEchart"],
  props: {
    type: { type: String, default: "value" },
    data: { type: [Array], default: () => [] },
    textStyle: {
      type: Object,
      default: () => ({
        color: "#111",
      }),
    },
    axisLabel: { type: Object, default: () => ({}) },
    splitLine: {
      type: Object,
      default: () => ({
        show: true,
        lineStyle: {
          color: ["#eaeaea"],
        },
      }),
    },
  },
  watch: {
    data(newV) {
      this.config.data = newV;
      this.rbEchart.updateEchart();
    },
  },
  data() {
    return {
      config: {},
    };
  },
  methods: {
    setConfig() {
      setConfig.call(this);
    },
    handleEchart() {
      if (!this.rbEchart) return;
      if (!this.rbEchart.config) return;
      if (!this.rbEchart.config.yAxis) return;

      this.rbEchart.config.yAxis.push(this.config);
    },
    remove() {
      if (!this.rbEchart) return;
      if (!this.rbEchart.config) return;
      if (!this.rbEchart.config.yAxis) return;

      const index = this.rbEchart.config.yAxis.findIndex((ele) => {
        return ele === this.config;
      });
      if (index !== -1) this.rbEchart.config.yAxis.splice(index, 1);
    },
  },

  destroyed() {
    this.remove();
  },
  unmounted() {
    this.remove();
  },
  created() {
    this.setConfig();
    this.handleEchart();
  },
};
// export default class Echart_yAxis extends Vue {
//   mmbEchart: any;
//   config: any = {};
//   declare $props: any;

// setConfig(): void {
//   setConfig.call(this);
// }

// handleMmbEchart(): void {
//   if (!this.mmbEchart?.config?.yAxis ?? undefined) return;
//   this.mmbEchart.config.yAxis.push(this.config);
// }

// remove(): void {
//   if (!this.mmbEchart?.config?.yAxis ?? undefined) return;
//   let index = this.mmbEchart.config.yAxis.findIndex((ele: any) => {
//     return ele === this.config;
//   });
//   if (index !== -1) this.mmbEchart.config.yAxis.splice(index, 1);
// }

//   created(): void {
//     this.setConfig();
//     this.handleMmbEchart();
//   }

//   unmounted(): void {
//     this.remove();
//   }
// }
</script>

<script>
import { setConfig } from "../../mixins/setConfig";
export default {
  render() {
    return null;
  },
  name: "rbEchart_xAxis",
  componentName: "rbEchart_xAxis",
  provide() {
    return {
      rbEchart_xAxis: this,
    };
  },
  inject: ["rbEchart"],
  props: {
    type: { type: String, default: "category" },
    data: { type: [Array], default: () => [] },
    textStyle: {
      type: Object,
      default: () => ({
        color: "#111",
      }),
    },
    axisLabel: { type: Object, default: () => ({}) },
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
      if (!this.rbEchart.config.xAxis) return;

      this.rbEchart.config.xAxis.push(this.config);
    },

    remove() {
      if (!this.rbEchart) return;
      if (!this.rbEchart.config) return;
      if (!this.rbEchart.config.xAxis) return;

      const index = this.rbEchart.config.xAxis.findIndex((ele) => {
        return ele === this.config;
      });
      if (index !== -1) this.rbEchart.config.xAxis.splice(index, 1);
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
// export default class Echart_xAxis extends Vue {
//   mmbEchart: any;
//   config: any = {};
//   declare $props: any;

//   setConfig(): void {
//     setConfig.call(this);
//   }

//   handleMmbEchart(): void {
//     if (!this.mmbEchart?.config?.xAxis ?? undefined) return;
//     this.mmbEchart.config.xAxis.push(this.config);
//   }

//   remove(): void {
//     if (!this.mmbEchart?.config?.xAxis ?? undefined) return;
//     let index = this.mmbEchart.config.xAxis.findIndex((ele: any) => {
//       return ele === this.config;
//     });
//     if (index !== -1) this.mmbEchart.config.xAxis.splice(index, 1);
//   }

//   unmounted(): void {
//     this.remove();
//   }

//   created(): void {
//     this.setConfig();
//     this.handleMmbEchart();
//   }
// }
</script>

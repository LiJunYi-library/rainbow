<template>
  <div
    :title="nativeTitle"
    class="echart"
    :class="filterBlur ? `filterBlur6` : ''"
    :style="`width:${width};`"
  >
    <div v-if="cursor" class="hover"></div>
    <div :class="$slots.top && 'top'"><slot name="top" /></div>
    <div
      class="echartElbox"
      v-loading="loading_"
      :style="`height:${height}px;width:${width};`"
    >
      <div
        class="echartEl"
        :style="`height:${height}px;width:${width};`"
        ref="echartEl"
        v-show="!isEmpty"
      />
      <slot :responseData="responseData_ || []" />
      <div v-show="isEmpty" class="tips">
        <img src="./imgs/none.png" v-if="showEmptyIcon" />
        <div class="emptyText"><slot name="empty">暂无数据</slot></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { setConfig } from "../../mixins/setConfig";
import fetchOptions from "../../mixins/fetchOptions";
import chinaMap from "./chinaMap.json";

export default {
  mixins: [fetchOptions],
  name: "rbEchart",
  componentName: "rbEchart",
  provide() {
    return {
      rbEchart: this,
    };
  },
  props: {
    cursor: Boolean,
    nativeTitle: String,
    showEmptyIcon: { type: Boolean, default: true },
    width: { type: String, default: "100%" },
    height: { type: String, default: "450" },
    echartType: String,
    title: {
      type: Object,
      default: () => ({
        top: 10,
        left: 10,
      }),
    },
    tooltip: {
      type: Object,
      default: () => ({
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      }),
    },
    grid: {
      type: Object,
      default: () => ({
        left: "50",
        right: "50",
        bottom: "10",
        top: "50",
        containLabel: true,
      }),
    },
    legend: { type: Object, default: () => ({ top: 10 }) },
    xAxis: { type: Array, default: () => [] },
    yAxis: { type: Array, default: () => [] },
    series: { type: Array, default: () => [] },
    init: Function,
    options: Object,
  },
  emits: ["update:init"],
  watch: {
    options(newV) {
      this.config = newV;
      this.updateEchart();
    },
    responseData_() {
      this.setIsEmpty();
    },
  },
  computed: {},
  data() {
    return {
      config: {},
      isEmpty: false,
      propsinit: this.init,
      textureSrc: "https://geo.datav.aliyun.com/areas/bound/100000_full.json",
      mapJson: chinaMap,
    };
  },
  methods: {
    getTexture() {
      return new Promise((resolve) => {
        const xml = new XMLHttpRequest();
        xml.onreadystatechange = () => {
          if (xml.readyState !== 4) return;
          if (xml.status !== 200) return;
          this.mapJson = JSON.parse(xml.responseText);
          resolve(this.mapJson);
        };
        xml.open("GET", this.textureSrc);
        xml.send();
      });
    },
    afterFetch() {
      this.setIsEmpty();
    },
    setIsEmpty() {
      if (!this.responseData_) {
        this.isEmpty = true;
        return;
      }
      this.isEmpty = this.responseData_.length === 0;
    },

    updateEchart() {
      this.$nextTick(() => {
        if (!this.config) return;
        if (!this.echart) return;
        if (!this.echart.setOption) return;
        this.echart.setOption(this.config);
      });
    },
    // eslint-disable-next-line
    async init_(...arg) {
      if (!this.$refs.echartEl) return;
      const { echartEl } = this.$refs;
      if (this.echartType === "map") {
        // await this.getTexture();
        echarts.registerMap("china", this.mapJson);
      }
      if (!this.echart) this.echart = echarts.init(echartEl);
      this.updateEchart();
      this.propsFetchData = this.propsinit;
      const res = await this.fetchData_();
      // eslint-disable-next-line
      return Promise.resolve(res);
    },

    async setEchart() {
      if (this.echartType === "map") {
        // await this.getTexture();
        this.config.visualMap = {
          left: "left",
          max: 100,
          formatter(value) {
            return `${value}%`;
          },
          inRange: {
            color: [
              "#F0F5FF",
              "#D8E4FF",
              "#A5C1FE",
              "#6396FF",
              "#185AF4",
              "#185AF4",
              "#185AF4",
              "#185AF4",
              "#185AF4",
              "#185AF4",
              "#185AF4",
            ],
          },
          text: ["High", "Low"],
          calculable: true,
        };
        echarts.registerMap("china", this.mapJson);
      }
      const { echartEl } = this.$refs;
      this.echart = echarts.init(echartEl);
      this.updateEchart();
    },
  },
  created() {
    setConfig.call(
      this,
      ["class"],
      [
        "options",
        "loading",
        "responseData",
        "request",
        "fetchData",
        "init",
        "height",
        "echartType",
        "width",
        "nativeTitle",
        "cursor",
        "interval",
        "isAwait",
        "filterBlur",
        "fetchListener",
      ]
    );
    this.$emit("update:init", this.init_);
  },
  mounted() {
    if (this.init) return;
    if (!this.$refs.echartEl) return;
    this.setEchart();
    this.setIsEmpty();
  },
};
</script>
<style lang="scss" scoped>
.echart {
  background: white;
  position: relative;
  .hover {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99;
    cursor: pointer;
  }

  .top {
    border-bottom: 1px solid #ececec;
  }
  .echartElbox {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .echartEl {
    width: 100%;
    cursor: pointer;
  }
  .emptyText {
    margin-top: 10px;
    text-align: left;
  }
  .tips {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    padding: 0 50px;
  }
}
</style>

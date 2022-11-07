<script>
import { useDate } from "@rainbow_ljy/jsapi";
useDate();
import base from "../../mixins/base";

export default {
  // inheritAttrs: false,
  mixins: [base],
  props: {
    type: String,
    trigger: Boolean,
    verdict: {
      type: Function,
      default() {
        return true;
      },
    },
    disabledDateStart: Date,
    disabledDateEnd: Date,
    defaultStartValue: Date,
    defaultEndValue: Date,
    startValue: { type: [String, Number, Object, Array, Date], default: "" },
    endValue: { type: [String, Number, Object, Array, Date], default: "" },

    fromEndDateAgo: {
      type: Object,
    },

    startDateAgo: {
      type: Object,
      default: () => ({}),
    },

    endDateAgo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      startValueData: this.startValue,
      endValueData: this.endValue,
      pickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > this.disabledDateEnd ||
            time.getTime() < this.disabledDateStart
          );
        },
      },
    };
  },
  watch: {
    startValue() {
      this.startValueData = this.startValue;
    },
    endValue() {
      this.endValueData = this.endValue;
    },
  },
  created() {
    this.initCreat();
  },
  mounted() {
    this.initMount();
  },
  methods: {
    initCreat() {
      if (!this.trigger) return;
      // date api from rainbow.js
      let dates = [
        new Date().setAgo(this.startDateAgo),
        new Date().setAgo(this.endDateAgo),
      ];
      if (this.defaultStartValue) dates[0] = this.defaultStartValue;
      if (this.defaultEndValue) dates[1] = this.defaultEndValue;
      if (this.fromEndDateAgo && dates[1])
        dates[0] = new Date(dates[1].getTime()).setAgo(this.fromEndDateAgo);
      this.emitInput(dates);
    },
    initMount() {},
    async emitInput(arr = ["", ""]) {
      if (!arr) arr = ["", ""];
      // console.log("emitInput :::      bbbbb", arr);
      const verdict = this.verdict(arr);
      if (!verdict) return;
      this.startValueData = arr[0];
      this.endValueData = arr[1];
      this.$emit("update:startValue", arr[0]);
      this.$emit("update:endValue", arr[1]);
      // console.log("emitInput :::", this.startValueData, this.endValueData);
    },
    bindDefaultAttrs() {
      return {};
    },
    bindDefaultEvents() {
      return {};
    },
  },
  render() {
    return this.$createElement("el-date-picker", {
      attrs: {
        "picker-options": this.pickerOptions,
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
        type: this.type,
        value: [this.startValueData, this.endValueData],
      },
      on: {
        ...this.bindDefaultEvents(),
        ...this.$listeners,
        input: (arr) => this.emitInput(arr),
      },
      ...this.bindDefaultProperty(),
    });
  },
};
</script>

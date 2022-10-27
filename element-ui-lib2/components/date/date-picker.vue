<script>
import {useDate} from '@rainbow_ljy/jsapi';
useDate();

export default {
  // inheritAttrs: false,
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
    value: {type: [String, Number, Object, Array, Date], default: ''},
    defaultValue: Date,

    dateAgo: {
      type: Object,
      default: () => ({
        FullYear: 0,
        Month: 0,
        Date: 0,
        Hours: 0,
        Minutes: 0,
        Seconds: 0,
        Time: 0,
        Milliseconds: 0,
        Day: 0,
      }),
    },
  },
  data() {
    return {
      valueData: this.value,
      pickerOptions: {
        disabledDate: time => {
          return (
            time.getTime() > this.disabledDateEnd ||
            time.getTime() < this.disabledDateStart
          );
        },
      },
    };
  },
  watch: {
    value() {
      this.valueData = this.value;
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
      let data = new Date().setAgo(this.dateAgo);
      if (this.defaultValue) data = this.defaultValue;
      this.emitInput(data);
    },
    initMount() {},
    async emitInput(value) {
    //  console.log('emitInput :::      bbbbb', value);
      const verdict = this.verdict(value);
      if (!verdict) return;
      console.log('emitInput :::', value);
      this.valueData = value;
      this.$emit('input', value);
    },
    bindDefaultAttrs() {
      return {};
    },
    bindDefaultEvents() {
      return {};
    },
  },
  render() {
    return this.$createElement('el-date-picker', {
      attrs: {
        'picker-options': this.pickerOptions,
        ...this.bindDefaultAttrs(),
        ...this.$attrs,
        type: this.type,
        value: this.valueData,
      },
      on: {
        ...this.bindDefaultEvents(),
        ...this.$listeners,
        input: value => this.emitInput(value),
      },
    });
  },
};
</script>

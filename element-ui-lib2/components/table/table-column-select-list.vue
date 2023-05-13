


<script>
import tableColumn from "./table-column.vue";
import { objectFilter } from "@rainbow_ljy/jsapi";
import SelectList from "../select/select-list.vue";

export default {
  extends: tableColumn,
  props: {
    selectDataProp: String,
    selectItemProp: String,
    selectData: Array,
  },
  data() {
    return {
      VALUE: "",
    };
  },
  methods: {
    emitInput(value) {},

    renderDefault(props) {
      let { row, column, $index } = props;
      let data = this.selectData || row[this.selectDataProp] || [];
      let ATTRS = objectFilter(this.$attrs, /_select/g);
      let EVENTS = this.$listeners;
      let VALUE = this.getValue(props) || "";
      let currentItem = undefined;
      // if(!VALUE) return ''
      return this.$createElement(SelectList, {
        attrs: {
          trigger: true,
          value: VALUE,
          currentItem: currentItem,
          data,
          ...ATTRS,
        },
        on: {
          input: (value) => {
            this.$set(row, this.prop, value);
          },
          "update:currentItem": (val) => {
            if (this.selectItemProp) this.$set(row, this.selectItemProp, val);
          },
          ...EVENTS,
        },
      });
    },
  },
};
</script>



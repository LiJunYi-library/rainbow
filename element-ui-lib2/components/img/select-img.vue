
<script>
import dataOptions from "../../mixins/dataOptions";
export default {
  mixins: [dataOptions],
  props: {
    multiple: Boolean,
    value: [String, Number, Object, Array],
    formatterValue: {
      type: Function,
      default: (item) => {
        if (!item) return "";
        if (item instanceof Object) return item.value;
        return item;
      },
    },
    currentItem: [String, Number, Object, Array],
  },
  watch: {
    currentItem() {
      this.currentData = this.currentItem;
    },
  },
  data() {
    return {
      currentData: this.currentItem,
    };
  },
  methods: {
    radioImg(val) {
      this.currentData = val;
      let value = this.formatterValue(this.currentData);
      this.$emit("input", value);
      this.$emit("change", value);
    },
  },
  render() {
    return (
      <div class="select-img">
        {this.data_.map((el) => (
          <img
            class={
              this.currentData === el ? "img-item img-item-active" : "img-item"
            }
            src={this.formatterValue(el)}
            onClick={() => this.radioImg(el)}
          ></img>
        ))}
      </div>
    );
  },
};
</script>
<style>
.select-img {
  overflow: auto;
  display: flex;
  flex-wrap: nowrap;
}

.select-img::-webkit-scrollbar {    width: 10px; height:  10px;}
.select-img::-webkit-scrollbar-track { 
    background: #409EFF20; 
    border-radius: 10px;
}
.select-img::-webkit-scrollbar-thumb {    
    border-radius:  10px; 
    box-shadow: inset 0 0  10px  10px #40a0ff;
}


.img-item {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-right: 5px;
}
/* .img-item:nth-last-of-type(1) {
  margin-right: 0px;
} */
.img-item-active {
  width: 80px;
  height: 80px;
}
</style>
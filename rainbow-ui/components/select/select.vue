<script>
class AdapterList {
  constructor(props) {
    Object.assign(this, props);
  }

  data = [];
}

class AdapterRadio extends AdapterList {
  constructor(props) {
    super(props);
  }

  value = null;

  setValue(item) {
    if (this.value === item) this.value = null;
    else this.value = item;
    this.updateValue(this.formatterValue(this.value));
  }

  formatterValue(value) {
    return value;
  }

  updateValue(value) {}

  active(item) {
    return item === this.value;
  }

  clearValue() {
    this.value = null;
  }

  removeValue(item) {
    this.value = null;
  }
}

class AdapterMultiple extends AdapterList {
  constructor(props) {
    super(props);
  }

  value = [];

  setValue(item) {
    if (this.active(item)) this.removeValue(item);
    else this.pushValue(item);
    this.updateValue(this.mapValue(this.value));
  }

  mapValue(array) {
    return array.map((el) => this.formatterValue(el));
  }

  formatterValue(value) {
    return value;
  }

  updateValue(value) {}

  active(item) {
    return this.value.includes(item);
  }

  clearValue() {
    this.value = [];
  }

  pushValue(item) {
    this.value.push(item);
  }

  removeValue(item) {
    this.value = this.value.filter((el) => el !== item);
  }
}

export default {
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    value: [Array, String, Number, Boolean, Object],
  },
  data() {
    return {
      keyWord: "",
      // listData: [],
      radioAdapter: new AdapterRadio({
        data: this.listData,
        updateValue: (value) => {
          this.$emit("input", value);
        },
        render(h) {
          if (!this.value) return null;
          return (
            <div>
              <div> {this.value.b} </div>
              <div onClick={() => this.clearValue(this.value)}>XXXXXX</div>
            </div>
          );
        },
      }),
      multipleAdapter: new AdapterMultiple({
        data: this.listData,
        formatterValue: (el) => el.b,
        updateValue: (value) => {
          this.$emit("input", value);
        },
        render(h) {
          if (!this.value) return null;
          return this.value.map((item) => (
            <div>
              <div> {this.formatterValue(item)} </div>
              <div onClick={() => this.removeValue(item)}>XXXXXX</div>
            </div>
          ));
        },
      }),
    };
  },
  renderList() {
    return this.listData.map((item) => <div>{item}</div>);
  },
  methods: {
    input(arg) {
      // console.log(arg);
      // console.log([arg.target]);
      // console.log(arg.target.value);

      console.log(this.$refs.label.rows);
    },
  },

  render(h) {
    // let list  =
    console.log(this);
    let adapter = this.radioAdapter;

    return (
      <div class="r-select">
        <span ref="label">label</span>
        <input value={this.keyWord} onInput={this.input}></input>

        {adapter.render(h)}

        <div>-------------------</div>
        {this.listData.map((item) => {
          return (
            <div
              onClick={() => adapter.setValue(item)}
              class={adapter.active(item) ? "active" : ""}
            >
              <div> {item.a}</div>
              <div> {item.b}</div>
              <div> {item.c}</div>
            </div>
          );
        })}
      </div>
    );
  },
};
</script>
<style>
.active {
  background: cyan;
}
</style>
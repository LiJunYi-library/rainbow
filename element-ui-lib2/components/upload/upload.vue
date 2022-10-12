
<script>
import fetchOptions from "../../mixins/fetchOptions";

export default {
  mixins: [fetchOptions],
  props: {
    base64: String,
    file: [File, null],
    accept: {
      type: String,
      default: "",
    },
    buttonText:  {
      type: String,
      default: "上传",
    },
  },
  data() {
    return { file_: this.file, base64_: this.base64 };
  },
  watch: {
    base64() {},
    file() {},
  },
  methods: {
    handleChange(e) {
      this.file_ = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.file_);
      reader.onload = async (e) => {
        this.base64_ = reader.result;
        this.$emit("update:base64", this.base64_);
        this.$emit("update:file", this.file_);
        this.$emit("choose", this.file_, this.base64_);
      };
    },

    bindDefaultAttrs() {
      return {};
    },

    renderDefaultSlot() {
      if (this.$slots.default) return this.$slots.default;
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default({ A: 111 });
      }
      return this.renderDefault();
    },

    renderDefault(props) {
      return (
        <m-button type="primary" loading={this.loading_}>
          {this.buttonText}
        </m-button>
      );
    },

    renderStartSlot() {
      if (this.$slots.start) return this.$slots.start;
      if (this.$scopedSlots.start) {
        return this.$scopedSlots.start({ A: 111 });
      }
      return this.renderStart();
    },

    renderStart(props) {
      return null;
    },

    renderEndSlot() {
      if (this.$slots.end) return this.$slots.end;
      if (this.$scopedSlots.end) {
        return this.$scopedSlots.end({ A: 111 });
      }
      return this.renderEnd();
    },

    renderEnd(props) {
      return null;
    },
  },
  render() {
    return (
      <div class="r-upload">
        {this.renderStartSlot()}
        <div class="r-upload-content">
          <input
            class="r-upload-input"
            type="file"
            accept={this.accept}
            onChange={(e) => this.handleChange(e)}
          />
          {this.renderDefaultSlot()}
        </div>
        {this.renderEndSlot()}
      </div>
    );
  },
};
</script>
<style >
.r-upload {
  display: inline-block;
}
.r-upload-content {
  position: relative;
}
.r-upload-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>

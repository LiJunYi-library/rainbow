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
    size: Number,
    placeholder: String,
    buttonText: {
      type: String,
      default: "上传",
    },
    showLink: Boolean,
  },
  data() {
    return { file_: this.file, base64_: this.base64, error: false };
  },
  watch: {
    base64() {},
    file() {},
  },
  methods: {
    handleChange(e) {
      this.error = false;
      this.file_ = e.target.files[0];
      console.log("handleChange", this.file_);
      if (!this.file_) return;
      if (this.size && this.size < this.file_.size) {
        this.error = true;
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(this.file_);
      reader.onload = async (e) => {
        this.base64_ = reader.result;
        this.$emit("update:base64", this.base64_);
        this.$emit("update:file", this.file_);
        this.afterTransitionFile();
        this.$emit("choose", this.file_, this.base64_);
        this.$refs.uploadInput.value = "";
      };
    },

    afterTransitionFile() {},

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

    remove() {
      if (this.$listeners.remove) {
        this.$listeners.remove(this.responseData_);
        return;
      }
      this.$emit("update:responseData", "");
    },
    renderPlaceholder() {
      if (this.error) return null;
      if (this.responseData_) return null;
      if (!this.placeholder) return null;
      return <div class="placeholder">{this.placeholder}</div>;
    },
    renderError() {
      if (!this.error) return null;
      return (
        <div class="r-upload-error-text">文件最大{this.size / 1024}kb</div>
      );
    },
  },
  render() {
    return (
      <div class="r-upload" v-loading={this.loading_}>
        {this.renderStartSlot()}
        <div class="r-upload-content">
          <input
            class="r-upload-input"
            type="file"
            placeholder={this.placeholder}
            ref="uploadInput"
            accept={this.accept}
            onChange={(e) => this.handleChange(e)}
          />
          {this.renderDefaultSlot()}
          {this.renderPlaceholder()}
          {this.renderError()}
        </div>

        {this.responseData_ && this.showLink && (
          <div class="r-upload-link-item">
            <el-link type="primary" onClick={() => open(this.responseData_)}>
              {this.responseData_}
            </el-link>
            <i
              class="el-icon-circle-close"
              style={"color:red"}
              onClick={() => this.remove()}
            ></i>
          </div>
        )}

        {this.renderEndSlot()}
      </div>
    );
  },
};
</script>
<style>
.r-upload-error-text {
  color: red;
}
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
  z-index: 100;
}

.r-upload-link-item {
  width: 100%;
  display: flex;
  align-content: center;
  align-items: center;
}
.r-upload-link-item a {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.r-upload-link-item span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.r-upload-link-item i {
  width: 20px;
  margin-top: 10px;
  text-align: right;
  cursor: pointer;
}
</style>

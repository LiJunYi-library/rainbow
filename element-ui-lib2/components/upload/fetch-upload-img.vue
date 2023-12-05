<script>
import FetchUpload from "./fetch-upload.vue";

export default {
  extends: FetchUpload,
  props: {
    shape: String,
    accept: {
      type: String,
      default: "image/png,image/jpg,image/jpeg,image/gif",
    },
  },
  data() {
    return {
      optionsVisible: false,
    };
  },
  methods: {
    onmouseenter() {
      this.optionsVisible = true;
    },
    onmouseleave() {
      this.optionsVisible = false;
    },
    renderDefault(props) {
      let style = {
        width: this.shape + "px",
        height: this.shape + "px",
      };
      return (
        <div
          class={["fetch-upload-img"]}
          style={style}
          v-loading={this.loading_}
        >
          {this.loading_ && (
            <img src={this.base64_} class="chooseImg" style={style} />
          )}
          {this.responseData_ && (
            <div class="img-con" style={style}>
              <img style={style} src={this.responseData_} />
              {this.optionsVisible && (
                <div class="img-options">
                  <i class="el-icon-delete" onClick={this.remove}></i>
                </div>
              )}
            </div>
          )}
          {!this.responseData_ && <i class="icon el-icon-plus"></i>}
        </div>
      );
    },
  },
};
</script>
<style>
.fetch-upload-img {
  width: 120px;
  height: 120px;
  background: rgb(237, 238, 238);
  position: relative;
}

.fetch-upload-img .close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 101;
  color: red;
}

.fetch-upload-img img,
.fetch-upload-img .img-con {
  width: 120px;
  height: 120px;
  vertical-align: bottom;
  position: absolute;
  left: 0;
  top: 0;
}

.img-options {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
}

.img-options i {
  color: white;
  z-index: 101;
  font-size: 18px;
}

.fetch-upload-img .chooseImg {
  width: 60px;
  height: 60px;
  vertical-align: bottom;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
}
.fetch-upload-img .icon {
  font-size: 60px;
  line-height: 120px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>


<script>
import FetchUpload from "./fetch-upload.vue";

export default {
  extends: FetchUpload,
  props: {
    accept: {
      type: String,
      default: "image/png",
    },
  },
  methods: {
    renderDefault(props) {
      console.log(this.responseData_);
      return (
        <div class="fetch-upload-img" v-loading={this.loading_}>
          {this.loading_ && <img src={this.base64_} class="chooseImg" />}
          {this.responseData_ && <img src={this.responseData_} />}
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
.fetch-upload-img img {
  width: 120px;
  height: 120px;
  vertical-align: bottom;
  position: absolute;
  left: 0;
  top: 0;
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


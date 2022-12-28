<script>
import { renderSlot, renderScopedSlots } from "../../utils";
export default {
  props: {
    title: [String, Number],
    img: String,
    size: { type: Number, default: 120 },
    imgFit: {
      type: String,
      default: "contain",
    },
  },
  render() {
    return (
      <div class="info-detail">
        <div class="title">
          {renderSlot.call(
            this,
            "title",
            null,
            null,
            this.title && <span>{this.title}</span>
          )}
        </div>
        <el-row type="flex">
          <div class="l">
            {renderSlot.call(
              this,
              "start",
              null,
              null,
              <el-image
                class="img"
                style={`width: ${this.size}px; height: ${this.size}px`}
                src={this.img}
                previewSrcList={[this.img]}
                fit={this.imgFit}
              >
                <div slot="error" class="image-slot-error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            )}
          </div>
          <div class="c">{renderSlot.call(this)}</div>
          <div class="r">{renderSlot.call(this, "end")}</div>
        </el-row>
      </div>
    );
  },
};
</script>

<style lang="scss">
.info-detail {
  .image-slot-error {
    background: rgb(227, 227, 227);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    padding: 5px 0;
    text-align: left;
    font-size: 18px;
    font-weight: 500;
  }
  .l {
    // background: red;
    .img {
      width: 120px;
      height: 120px;
      vertical-align: bottom;
    }
  }
  .c {
    flex: 1;
    // background: yellow;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
    padding: 0 15px;
  }
  .r {
    padding: 0 15px;
    // background: blue;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
  }
}
</style>
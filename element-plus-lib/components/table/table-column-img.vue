<script>
import tableColumn from "./table-column.vue";
import { h, createVNode, resolveComponent } from "vue";
import { objectFilter } from "../../utils/obj";
import { styleType } from "element-plus/es/components/table-v2/src/common";

export default {
  extends: tableColumn,
  props: {},
  data() {
    return {
      dissociateImg: null,
    };
  },
  created() {
    this.createImage();
  },
  methods: {
    renderDefaultDefault(...arg) {
      // const el_button = resolveComponent("el-button");
      // let buttonAttrs = objectFilter(this.$attrs, /_button/g);
      let str = this.getValue(...arg);
      return (
        <img
          style="width: 50px;height: 50px;"
          src={str}
          onmouseout={(e) => this.imgMouseout(e)}
          onmousemove={(e) => this.imgMousemove(e)}
          onclick={(e) => this.openWindow(...arg)}
        ></img>
      );
    },

    imgMousemove(event) {
      let node = this.dissociateImg;
      node.src = event.target.src;
      node.style.display = "block";
      node.style.left = `${event.pageX + 10}px`;
      let img = document.getElementById("dissociateImg");
      let bottom = event.pageY + img.height / 2;
      let top =
        bottom > window.innerHeight
          ? window.innerHeight - img.height
          : event.pageY - img.height / 2;
      node.style.top = `${top}px`;
    },

    imgMouseout(event) {
      let node = this.dissociateImg;
      node.style.display = "none";
      node.style.left = `${0}px`;
      node.style.top = `${0}px`;
    },

    openWindow(...arg) {
      let url = this.getValue(...arg);
      if (url) window.open(url);
    },

    createImage() {
      this.dissociateImg = document.getElementById("dissociateImg");
      if (!this.dissociateImg) {
        let img = document.createElement("img");
        img.id = "dissociateImg";
        img.style.display = "none";
        img.style.position = "fixed";
        img.style.zIndex = "99";
        img.style.width = "400px";
        document.body.appendChild(img);
        this.dissociateImg = img;
      }
    },
  },
};
</script>

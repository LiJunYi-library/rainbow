<script>
import {
  mergeEvent,
  r_resizeObserver,
  r_mergeResizeObserver,
  r_onceResizeObserver,
} from "@rainbow_ljy/jsapi";
import { renderSlot, getSlotVnode } from "../../utils/index";

export default {
  data() {
    return {
      resizeObserver: null,
    };
  },
  methods: {
    creatResizeObserver() {
      this.resizeObserver = r_resizeObserver(this.$el, (event) => {
        let offset = this.$el.getBoundingClientRect();
        this.$parent.headerHeight = offset.height;
      });
    },
    destroyResizeObserver() {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    },
  },
  render() {
    return (
      <div class="r-virtual-list-header">
        {renderSlot.call(this, "default")}
      </div>
    );
  },
  mounted() {
    this.creatResizeObserver();
    let offset = this.$el.getBoundingClientRect();
    this.$parent.headerHeight = offset.height;
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
};
</script>
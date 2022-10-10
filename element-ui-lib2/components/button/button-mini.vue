<script>
import Button from "./button.vue";
export default {
  extends: Button,
  methods: {
    bindDefaultAttrs() {
      return {
        type: "primary",
        size: "mini",
      };
    },
  },
};
</script>
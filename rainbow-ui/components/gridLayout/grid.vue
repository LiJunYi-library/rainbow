<template>
  <div class="rb-grid" :style="`padding:${space}px;`" v-loading="loading_">
    <template v-for="(numList, nth) in indexList">
      <div :key="nth" class="column">
        <template v-for="(index, len) in numList">
          <div :key="index" class="item">
            <slot :item="responseData_[index]" />
          </div>
          <div
            :key="index + 'spaceItem'"
            class="columnSpace"
            :style="`width: ${space}px;`"
            v-if="len < numList.length - 1"
          />
        </template>
        <template v-for="index in columnCount - numList.length">
          <div
            :key="index + 'spaceItem'"
            class="columnSpace"
            :style="`width: ${space}px;`"
          />
          <div :key="index" class="itemSpace" />
        </template>
      </div>
      <div
        :style="`height: ${space}px;`"
        :key="nth + 'row'"
        class="rowSpace"
        v-if="nth < indexList.length - 1"
      />
    </template>
    <template v-if="indexList.length === 0">
      <slot name="empty"> <div class="empty">空空如也</div> </slot>
    </template>
  </div>
</template>
<script>
import fetchOptions from "../../mixins/fetchOptions";
export default {
  props: {
    space: { type: Number, default: 10 },
    columnCount: { type: Number, default: 2 },
  },
  mixins: [fetchOptions],
  data() {
    return {
      indexList: [],
    };
  },
  watch: {
    loading_() {},
    responseData_() {
      this.indexList = this.responseData_.splitIndex(2);
    },
  },
  created() {
    this.indexList = this.responseData_.splitIndex(this.columnCount);
  },
};
</script>
<style lang="scss" >
.rb-grid {
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // background: cyan;
  .columnSpace {
    height: 100%;
  }
  .rowSpace {
    width: 100%;
  }
  .column {
    display: flex;
    align-items: center;
    .item {
      flex: 1;
    }
    .itemSpace {
      flex: 1;
    }
  }
}
</style>
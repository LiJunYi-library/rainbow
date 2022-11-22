



<template>
  <table cellspacing="0" cellpadding="0" class="el-date-table">
     <!--<tbody>
      @click="handleClick"
    @mousemove="handleMouseMove"
    :class="{ 'is-week-mode': selectionMode === 'week' }" 
      <tr>
        <th v-for="(week, key) in WEEKS" :key="key">{{ week }}</th>
      </tr>
      <tr
        class="el-date-table__row"
        v-for="(row, key) in rows"
        :class="{ current: isWeekActive(row[1]) }"
        :key="key"
      >
        <td v-for="(cell, key) in row" :class="getCellClasses(cell)" :key="key">
          <div>
            <span>
              {{ cell.text }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>-->
  </table>
</template>

<script>
export default {
  data() {
    return {
      WEEKS: ["日", "一", "二", "三", "四", "五", "六"],
    };
  },
};
</script>



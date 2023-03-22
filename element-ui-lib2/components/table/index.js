import table from './table.vue';
import fetchTable from './fetch-table.vue';
import tableColumn from './table-column.vue';
import tableColumnBut from './table-column-but.vue';
import tableColumnImg from './table-column-img.vue';
import tableColumnList from './table-column-list.vue';
import tableColumnOperation from './table-column-operation.vue';
import tableColumnTooltip from './table-column-tooltip.vue';
import tableColumnStatus from './table-column-status.vue';
import tableColumnTable from './table-column-table.vue';
import tableColumnSelectList from './table-column-select-list.vue';
import tableColumnFixed from './table-column-fixed.vue';
import tableColumnLink from './table-column-link.vue';
import fetchListTable from './fetch-list-table'

export default {
  table,
  'fetch-list-table': fetchListTable,
  'fetch-table': fetchTable,
  'table-column': tableColumn,
  'table-column-but': tableColumnBut,
  'table-column-img': tableColumnImg,
  'table-column-list': tableColumnList,
  'table-column-operation': tableColumnOperation,
  'table-column-tooltip': tableColumnTooltip,
  'table-column-status': tableColumnStatus,
  'table-column-table': tableColumnTable,
  'table-column-select-list': tableColumnSelectList,
  'table-column-fixed': tableColumnFixed,
  'table-column-link': tableColumnLink,
}


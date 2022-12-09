<script>
import {renderSlot, renderScopedSlots} from '../../utils';
import dataOptions from '../../mixins/dataOptions';
import base from '../../mixins/base';

export default {
  mixins: [dataOptions, base],
  props: {
    trigger: Boolean,
    label: String,
    selectIndex: {type: Number, default: -1},
    props: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label',
        value: 'value',
      }),
    },
    currentItem: [Object, Array],
    currentTree: [Object, Array],
    value: {type: [String, Number, Object, Array], default: () => []},
    multiple: {type: Boolean, default: false},
  },
  data() {
    return {
      currentItemData: this.currentItem,
      currentTreeData: this.currentItem,
      valueData: this.value || [],
    };
  },
  watch: {
    value() {
      this.valueData = this.value;
      // console.log('watch  value', this.valueData, this.value);
    },
  },
  render() {
    return (
      <div class="el-lib-cascader">
        {this.label && <div class="label">{this.label}</div>}
        {renderSlot.call(this, 'start', this.valueData)}
        {this.renderElement()}
        {renderSlot.call(this, 'end', this.valueData)}
      </div>
    );
  },
  methods: {
    renderElement() {
      let props = {multiple: this.multiple, ...this.props};
      return this.$createElement('el-cascader', {
        ref: 'elCascader',
        class: 'lib-el-cascader',
        attrs: {
          clearable: true,
          options: this.data_ || [],
          props,
          ...this.bindDefaultAttrs(),
          ...this.$attrs,
          value: this.valueData,
        },
        on: {
          ...this.bindDefaultEvents(),
          ...this.$listeners,
          input: value => this.emitInput(value),
          change: (...value) => this.onChange(...value),
          'expand-change': (...value) => this.onExpandChange(...value),
        },
        scopedSlots: {
          default: renderScopedSlots.call(this, 'default', this.renderDefault),
          empty: renderScopedSlots.call(this, 'empty', this.renderEmpty),
        },
        ...this.bindDefaultProperty(),
      });
    },

    emitInput(value) {
      // console.log('emitInput  ===== ', value);
      this.valueData = value;
      this.$emit('input', value);
      this.setCurrent(value);
    },

    setCurrent(value) {
      let {currentItemData, currentTreeData} = this.getCurrent(value);
      this.currentItemData = currentItemData;
      this.currentTreeData = currentTreeData;
      this.$emit('update:currentItem', currentItemData);
      this.$emit('update:currentTree', currentTreeData);
    },

    getCurrent(value) {
      let CheckedNodes = this.$refs.elCascader.getCheckedNodes();
      // console.log(' getCurrent ==========  CheckedNodes  ', CheckedNodes);
      let currentTreeData = CheckedNodes || [];
      let currentItemData = currentTreeData.map(el => el.data);
      // console.log('>>>>currentTreeData>>>>>', currentTreeData);
      // console.log('>>>>>currentItemData>>>>', currentItemData);
      return {currentItemData, currentTreeData};
    },

    onChange(val) {
      // console.log('onChange==========', val);
      this.$nextTick(() => {
        let {currentItemData, currentTreeData} = this.getCurrent(val);
        this.setCurrent(val);
        this.$emit('change', val, currentItemData, currentTreeData);
        if (this.onChangeCB)
          this.onChangeCB(val, currentItemData, currentTreeData);
      });
    },

    onExpandChange(val) {
      let {currentItemData, currentTreeData} = this.getCurrent(val);
      this.$emit('expand-change', val, currentItemData, currentTreeData);
      if (this.onExpandChangeCB)
        this.onExpandChangeCB(val, currentItemData, currentTreeData);
    },

    bindDefaultAttrs() {
      return {};
    },

    bindDefaultEvents() {
      return {};
    },

    renderDefault(props) {
      return null;
    },

    renderEmpty(props) {
      return null;
    },
  },
};
</script>
<style>
.el-lib-cascader {
  display: inline-flex;
  align-items: center;
}

.el-lib-cascader .label {
  white-space: nowrap;
}

.lib-el-cascader {
  min-width: 100px;
}
</style>

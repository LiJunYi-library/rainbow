import { Queue, QueuePromise } from '@rainbow_ljy/jsapi';


class FetchListener {

  constructor(
    dataListener,
    vm = { loading_: false },
    props = {
      isSetResponseData: false,
      tag: 'data',
    },
  ) {
    this.isFun = dataListener instanceof Function;
    this.isArray = dataListener instanceof Array;
    this.loading = false;
    this.promise = null;
    this.queuePromise = new QueuePromise((resolve, reject) => {
      if (!this.promise) {
        resolve(null);
        return;
      }
      this.promise
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });

    this.onApply = () => {
      // eslint-disable-next-line
      vm.loading_ = true;
      this.loading = true;
      vm.$emit('update:loading', this.loading_);
      if (vm.beforeFetch) vm.beforeFetch();
    };

    this.afterApply = res => {
      const isPromise = res instanceof Promise;
      if (!isPromise) {
        this.loading = false;
        vm.loading_ = !(
          vm.dataL.loading === false &&
          vm.listenerL.loading === false
        );
        vm.$emit('update:loading', vm.loading_);
        if (!props.isSetResponseData) return;
        vm.responseData_ = data;
        vm.$emit('update:responseData', vm.responseData_);
        return;
      }
      this.promise = res;
      this.queuePromise
        .then(data => {
          if (!props.isSetResponseData) return;
          // console.log('afterApply  then', data);
          // eslint-disable-next-line
          vm.responseData_ = data;
          vm.$emit('update:responseData', vm.responseData_);
          if (vm.afterFetch) vm.afterFetch();
        })
        .finally(() => {
          // console.log('afterApply finally');
          this.loading = false;
          vm.loading_ = !(
            vm.dataL.loading === false &&
            vm.listenerL.loading === false
          );

          vm.$emit('update:loading', vm.loading_);
        });
    };

    this.bindApply = fun => {
      fun.addOnApplyListener(this.onApply);
      fun.addAfterApplyListener(this.afterApply);
    };

    this.unbindApply = fun => {
      fun.removeOnApplyListener(this.onApply);
      fun.removeAfterApplyListener(this.afterApply);
    };

    this.bindListener = () => {
      if (!dataListener) return;
      if (this.isFun) this.bindApply(dataListener);
      if (this.isArray)
        dataListener.forEach(element => this.bindApply(element));
    };

    this.unbindListener = () => {
      if (!dataListener) return;
      if (this.isFun) this.unbindApply(dataListener);//.filter(Boolean)
      if (this.isArray)
        dataListener.forEach(element => this.unbindApply(element));
    };

    FetchListener[props.tag] = this;
    //
  }
}

FetchListener.data = null;
FetchListener.listener = null;

export default {
  props: {
    interval: { type: Number, default: 1000 }, // 当过快请求时防抖节流的时间
    isAwait: { type: Boolean, default: false }, // 是否等待请求完成
    filterBlur: { type: Boolean, default: false }, // 是否是模糊
    loading: { type: Boolean, default: false }, // 是否在加载
    responseData: [Array, Object, Boolean, String, Number], // 请求数据
    fetchData: [Function, Object, Promise, Array], // 请求函数
    fetchListener: [Function, Object, Promise, Array], // 监听请求
  },
  data() {
    return {
      loading_: this.loading,
      responseData_: this.responseData,

      listenerL: new FetchListener(this.fetchListener, this, {
        isSetResponseData: false,
        tag: 'listener',
      }),

      dataL: new FetchListener(this.fetchData, this, {
        isSetResponseData: true,
        tag: 'data',
      }),
    };
  },
  watch: {
    responseData(newV) {
      this.responseData_ = newV;
    },
    loading(newV) {
      this.loading_ = newV;
    },
  },
  created() {
    this.listenerL.bindListener();
    this.dataL.bindListener();
  },
  beforeDestroy() {
    this.listenerL.unbindListener();
    this.dataL.unbindListener();
  },
  destroyed() {
    this.listenerL.unbindListener();
    this.dataL.unbindListener();
  },
  methods: {},
};

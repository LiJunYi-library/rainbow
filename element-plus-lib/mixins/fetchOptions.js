import { QueuePromise } from '@rainbow_ljy/jsapi';

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
      vm.loading_ = true;
      this.loading = true;
      vm.$emit('update:loading', this.loading_);
      if (vm.beforeFetch) vm.beforeFetch();
      if (!props.isSetResponseData) return;
      vm.isFetchError = false;
    };

    this.afterApply = (res, thisTarget) => {
      if (props.isSetResponseData && vm.isAwait) thisTarget.lock = true;
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
          thisTarget.lock = false;
          vm.responseData_ = data;
          vm.$emit('update:responseData', vm.responseData_);
          if (vm.afterFetch) vm.afterFetch();
        })
        .catch(({ data, errorText } = {}) => {
          if (!props.isSetResponseData) return;
          thisTarget.lock = false;
          vm.responseData_ = data;
          vm.$emit('update:responseData', vm.responseData_);
          if (vm.errorFetch) vm.errorFetch(data, errorText);
          vm.isFetchError = true;
          if (errorText !== undefined) vm.errorText = errorText;
        })
        .finally(() => {
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
  emits: ["update:loading", "update:responseData"],
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

      isFetchError: false,
      errorText: "网络开小差了 点击重新加载",
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
  mounted() {
  },
  beforeDestroy() {
    this.listenerL.unbindListener();
    this.dataL.unbindListener();
  },
  destroyed() {
    this.listenerL.unbindListener();
    this.dataL.unbindListener();
  },
  unmounted() {
    this.listenerL.unbindListener();
    this.dataL.unbindListener();
  },
  beforeUnmount() {
    this.listenerL.unbindListener();
    this.dataL.unbindListener();
  },
  methods: {
    bindLoading() {
      return this.loading_;
    },
    callFetchData() {
      if (this.fetchData instanceof Array) {
        this.fetchData.forEach((fun) => {
          fun();
        });
      }
      if (this.fetchData instanceof Function) {
        this.fetchData();
      }
    }
  },
};

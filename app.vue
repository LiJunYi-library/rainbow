<template>
  <div class="prepaid_refill">
    <div class="content">
      <div class="ListBox">
        <div class="header" :style="`background-image: url(${headerImg});`">
          <img
            class="back"
            @click="goBack"
            src="../images/delivery_red_envelope_back.png"
          />
          <img
            class="imgTitle"
            src="../images/delivery_red_envelope_text.png"
          />
          <div class="activeHint">
            累计已在全网找到{{ list.length }}个话费活动
          </div>
        </div>
        <div
          class="stickyHeader"
          :style="`background-image: url(${stickyHeaderImg});`"
        >
          <img
            class="goBack"
            @click="goBack"
            src="../images/delivery_red_envelope_back.png"
          />
          <div class="stickyHeaderTit">话费优惠天天享</div>
        </div>
        <div class="informBox">
          <img class="bell" src="../images/delivery_red_envelope_bell.png" />
          <div class="text">每天11:00、17:00提醒我领红包</div>
          <van-switch
            class="switch"
            size="18px"
            :model-value="isInform"
            @update:model-value="openInform"
            active-color="#4426FF"
          />
        </div>
        <div class="discounts">
          <img class="tagImg" src="../images/leftTag.png" />
          <span> 今日共找到8个精选充值优惠</span>
          <img class="tagImg" src="../images/rightTag.png" />
        </div>
        <div class="detection">10:00 检测有效</div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            class="list"
            v-model="loading"
            offset="300"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div class="item" v-for="(item, index) in list" :key="index">
              <img :src="item.activityImage" class="left" />
              <div class="right">
                <div class="right-top">
                  <div class="tit">{{ item.activityTitle }}</div>
                  <div
                    class="tags"
                    v-for="(tag, index) in item.activityLabel"
                    :key="index"
                  >
                    {{ tag }}
                  </div>
                </div>

                <div class="other">{{ item.platformName }}</div>
                <van-button
                  class="but"
                  size="small"
                  round
                  type="primary"
                  @click="recharge(item)"
                >
                  去充值
                </van-button>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import Config from '../helper/Config';
import MainUtils from '@/utils/MainUtils';

export default class App extends Vue {
  isInform = false;

  // eslint-disable-next-line global-require
  headerImg = require('../images/prepaid_refill_bg.png');

  // eslint-disable-next-line global-require
  stickyHeaderImg = require('../images/prepaid_refill_sticky.png');

  userInfo: any = {};

  $dialog: any;

  list: any[] = [];

  loading = true;

  finished = false;

  refreshing = false;

  mounted(): void {
    MainUtils.apiready(async () => {
      this.init();
    });
  }

  async init(): Promise<void> {
    MainUtils.logTrackV2({
      hs: 'HuafeiPage_EX',
      log: '进入话费充值页面',
      trackData: {
        cfrom: MainUtils.getQueryString(window.location.href, 'cFrom'),
      },
    });
    this.userInfo = MainUtils.appInfo();
    this.initLinstener();
    this.loading = false;
    this.onLoad();
  }

  initLinstener(): void {
    window.addEventListener('mmbViewDidFocus', async () => {
      console.log('mmbViewDidFocus');
      if (MainUtils.isLogin()) {
        console.log('登录成功');
        await this.foodDeliveryPushMsg(true);
        this.$dialog
          .confirm({
            showCancelButton: false,
            confirmButtonText: '知道了',
            message:
              '您已开启外卖红包领取通知，请注意您是否同时开启了app推送权限，避免无法接收推送哦',
          })
          .then(async () => 0)
          .catch(() => 0);
      }
      this.isInform = MainUtils.isLogin();
    });
  }

  async openInform(checked: boolean): Promise<void> {
    if (MainUtils.isLogin()) {
      console.log('foodDeliveryPushMsg', checked);
      await this.foodDeliveryPushMsg(checked);
      if (checked) {
        this.$dialog
          .confirm({
            showCancelButton: false,
            confirmButtonText: '知道了',
            message:
              '您已开启外卖红包领取通知，请注意您是否同时开启了app推送权限，避免无法接收推送哦',
          })
          .then(async () => 0)
          .catch(() => 0);
      }
      this.isInform = checked;
    } else {
      this.goToLogin();
    }
  }

  goToLogin(): void {
    MainUtils.routerAction({
      scene: 'NoScene',
    });
  }

  async foodDeliveryPushMsg(useFlag: boolean): Promise<void> {
    const userName =
      this.userInfo.username ||
      MainUtils.getQueryString(window.location.href, 'userName');
    const res = await MainUtils.ajaxPost(
      `${Config.javaUrl}/callActivity/callActivityPushMsg`,
      'json',
      {useFlag, userName},
    );
    console.log('callActivityPushMsg', res);
    return res;
  }

  recharge(item: any): void {
    window.open(item.activityUrl);
  }

  async onLoad(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    setTimeout(async () => {
      this.refreshing = false;
      const ret = await MainUtils.ajaxPost(
        `${Config.javaUrl}/callActivity/callActivityList`,
        'json',
        {},
      );
      MainUtils.logTrackV2({
        hs: 'HuafeiPage_discount_Ex',
        log: '活动出现',
        trackData: {
          title: '标题',
          url: '活动对应的链接',
          sort: '出现的活动的排序',
          mall: '左下角的商城',
        },
      });
      console.log(ret);
      if (ret.code !== 2000) return;
      this.list = ret.data;
      this.loading = false;
      this.finished = true;
      // this.list = this.list.concat([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      // this.loading = false;
      // console.log('push');
      // if (this.list.length >= 40) {
      //   this.finished = true;
      // }
    }, 0);
  }

  goBack(): void {
    MainUtils.closeWin();
  }

  onRefresh(): void {
    this.finished = false;
    this.list = [];
    this.loading = false;
    this.onLoad();
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow: auto;
}
.prepaid_refill {
  width: 100vw;
  height: 100vh;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .prepaid_refill_bg {
    width: 100vw;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }

  .stickyHeader {
    margin-top: -88px;
    position: sticky;
    width: 100vw;
    height: 88px;
    top: 0;
    left: 0;
    background-size: 100% 100%;
    z-index: 20;
    .goBack {
      margin-top: 52px;
    }
    .stickyHeaderTit {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 13px;
    }
  }
  .header {
    z-index: 50;
    height: 88px;
    width: 100vw;
    top: 0;
    left: 0;
    height: 261px;
    text-align: center;
    overflow: hidden;
    position: relative;
  }

  .content {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .back {
    width: 36px;
    height: 28px;
    display: block;
    margin-top: 52px;
  }
  .imgTitle {
    width: 277px;
    height: 78px;
    display: block;
    margin: 0 auto;
    margin-top: 21px;
  }

  .tags {
    display: inline-block;
    background: #ff440016;
    border-radius: 2px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff4400;
    padding: 1px 4px 3px 4px;
  }

  .activeHint {
    display: inline-block;
    margin: 0 auto;
    margin-top: 18px;
    // width: 200px;
    height: 28px;
    line-height: 28px;
    background: #ffffff30;
    border-radius: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    padding: 0 20px;
  }

  .informBox {
    box-sizing: border-box;
    padding: 0 11px;
    width: 351px;
    height: 50px;
    background: #ffffff;
    border-radius: 8px;
    opacity: 0.85;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    left: 50%;
    z-index: 99;
    transform: translateX(-50%);
    position: fixed;
    bottom: 30px;
    align-items: center;
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    .bell {
      width: 28px;
      height: 29px;
    }
    .text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4a31ff;
      margin-left: 10px;
    }
    .switch {
      position: absolute;
      right: 11px;
    }
  }

  .discounts {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #4124f5;
    margin-top: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .tagImg {
      width: 16px;
      height: 6px;
      padding: 0 6px;
    }
  }
  .detection {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #888888;
    line-height: 12px;
    margin-top: 10px;
    text-align: center;
    margin-bottom: 16px;
  }

  ///////

  .ListBox {
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    position: relative;
    .list {
      // background: #ffffff;
      border-radius: 8px;
    }
  }

  .inform {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgb(252, 220, 161);
    color: orange;
  }

  .item {
    padding: 10px;
    display: flex;
    background: white;
    margin: 5px 10px;
    border-radius: 8px;
    .left {
      width: 100px;
      height: 100px;
      border: none;
      border-radius: 8px;
    }
    .right {
      margin-left: 10px;
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      .right-top {
        flex: 1;
      }
      .tit {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #141516;
        line-height: 16px;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .other {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888888;
        line-height: 14px;
      }
      .but {
        position: absolute;
        background: #ff4400;
        right: 0;
        bottom: 0;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        border: none;
        width: 73px;
        height: 30px;
      }
    }
  }

  .snack {
    text-align: center;
  }

  .mT20 {
    margin-top: 20px;
  }

  .f24 {
    font-size: 24px;
  }
  .f20 {
    font-size: 20px;
  }
  .f24 {
    font-size: 24px;
  }
}
</style>

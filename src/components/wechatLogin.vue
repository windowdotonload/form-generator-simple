<template>
  <div class="hello" style="width:100%;height:100%;background:#fff">
    <div class="login-img">
      <img src="../assets/backImg.jpg" style="height:100%;width:100%;object-fit: cover;" />
      <div class="login-box">
        <div style="position:relative;height:372px;">
          <img src="../assets/logo-1.png" style="margin-top:30px;width:160px;height:30px" />
          <!-- 承载二维码容器 -->
          <div id="qrcode"></div>
          <div style="font-size:13px;margin-top:10px;color:#F56C6C;position: absolute;top:70%;left:39%;font-weight:bold;">微信扫一扫登录</div>
          <div
            style="font-size:12px;line-height:20px;text-align:center;background:#ebeef6;color:#4873b4;padding:14px 0px;position:absolute;bottom:0px;left:0px;right:0px;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;"
          >
            <div>通过微信搜索小程序“美孚数智”</div>
            <div>体验便捷高效线上服务</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { constContent } from "../utils/index";
export default {
  name: "wechatLogin",
  data() {
    return {};
  },
  mounted() {
    localStorage.setItem("backName", "/wechatLogin");
    sessionStorage.removeItem("menuTree");
    if (constContent(this.$route.query.msg)) {
      this.$message({
        type: "error",
        message: this.$route.query.msg
      });
      this.$router.push({
        path: this.$route.path,
        query: ""
      });
    }
    if (this.$route.query.code == 3600) {
      this.$alert("若要继续登录，请联系「管理员」为您的账号进行设置", "您的账号已失效!", {
        confirmButtonText: "知道了",
        confirmButtonClass: "sure-name",
        customClass: "alert-name",
        showClose: false,
        callback: action => {}
      });
      this.$router.push({
        path: this.$route.path,
        query: ""
      });
    }
    this.get_wx_qrcode();
  },
  watch: {},
  methods: {
    // getloginEnter() {
    //     window.location.href=`${process.env.api}/web/system/wxLogin`
    // },

    get_wx_qrcode() {
      let appidCon = "";
      if (`${process.env.NODE_ENV}` == "production") {
        appidCon = "wx66d41f1ecfb87c55";
      } else {
        appidCon = "wx4ca97fe6f0c1d079";
      } //从微信的开发文档不难看出回调域名需要经过encodeURIComponent处理
      var obj = new WxLogin({
        self_redirect: false, // 是否开启新页面展示二维码
        id: "qrcode", //需要承载二维码的容器id
        appid: appidCon,
        scope: "snsapi_login", //网页授权，目前网页只有这一种方式，静默授权
        redirect_uri: encodeURIComponent(`${process.env.web}/web/system/wxLoginCallBack`), //回调域名
        state: Math.random(), // state参数用于二次检验，可自行设置随机字符串等
        response_type: "code",
        style: "white",
        href:
          "data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDE2MHB4O2JvcmRlcjpub25lO30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMDBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30gCi5pbXBvd2VyQm94IC5pbmZve2Rpc3BsYXk6IG5vbmU7fQ=="
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login-img {
  width: 100%;
  height: 400px;
  position: absolute;
  top: 21.5%;
  background: #fef5f6;
}
.login-box {
  position: absolute;
  right: 128px;
  top: 14px;
  text-align: center;
  background: #fff;
  width: 364px;
  height: 372px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
#qrcode {
  display: inline-block;
  position: absolute;
  z-index: 100;
  top: 78%;
  right: 8%;
  transform: translateY(-50%);
}
.impowerBox .qrcode {
  width: 150px;
}
</style>
<style lang="less">
.alert-name {
  .sure-name {
    background: #fff;
    color: #001450 !important;
    border-color: #fff !important;
    font-size: 18px !important;
  }
  .el-message-box__title {
    text-align: center !important;
    font-size: 24px !important;
    padding: 20px 40px;
  }
  .el-message-box__content {
    font-size: 18px !important;
    padding: 0px 40px 30px;
  }
}
</style>

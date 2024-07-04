<template>
  <div class="hello" style="width: 100%; height: 100%; background: #fff">
    <div class="login-img">
      <img src="../assets/backImg.jpg" class="cover" style="height: 100%; width: 100%" />

      <div class="login-box">
        <img src="../assets/logo-1.png" style="margin-top: 30px; width: 155px; height: 29px" />
        <div style="margin-top: 20px">美孚员工后台</div>

        <div v-if="showDev">
          <el-form ref="devRef" :model="devForm" :rules="rules" class="dev-form" label-width="80px" label-position="top">
            <el-form-item prop="userId" label="dev环境输入userId">
              <el-input v-model="devForm.userId" @keyup.enter.native="loginForDev" placeholder="请输入userId"></el-input>
            </el-form-item>
            <el-button type="primary" @click="loginForDev">登录</el-button>
          </el-form>
        </div>
        <el-button v-else type="danger" class="login-out" @click="getloginEnter">
          单点登入
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestMethodGet } from "@/api/api";
export default {
  name: "HelloWorld",
  data() {
    return {
      activeName: "first",
      state1: "",
      showDev: process.env.NODE_ENV === "local" ? true : false,
      devForm: {
        userId: ""
      },
      rules: {
        userId: { required: true, message: "请输入userId", trigger: "blur" }
      }
    };
  },
  created() {
    this.$gio.toLoginPage({
      entrance: "URL网址"
    });
  },
  mounted() {
    this.$cookies.remove("MSDPAuthorization");
  },
  methods: {
    setLoginOut() {
      let params = {};
      this.requestMethodGet("/web/system/logout", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            sessionStorage.removeItem("menuList");
            sessionStorage.removeItem("userInfo");
            sessionStorage.removeItem("btnPremissions");
            this.backPathName = localStorage.getItem("backName");
            if (this.backPathName == "/login") {
              this.$router.push({
                //核心语句
                path: "/login" //跳转的路径
              });
            } else {
              this.$router.push({
                //核心语句
                path: "/wechatLogin" //跳转的路径
              });
            }
            localStorage.removeItem("backName");
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
      // window.location.href = `${process.env.api}/web/system/logout`;
    },
    setCookie(name, tokenId, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie = `${name}=${tokenId};path=/;expires=` + exdate.toGMTString();
    },
    async getloginEnter() {
      // window.location.href=`https://msdpsit.inossem.com/msdp/web/system/login`
      // window.location.href = `${process.env.web}/web/system/ssoLogin`;
      const res = await requestMethodGet("/web/system/ssoLogin");
      window.location.href = res.data.data;
      this.$gio.clickLoginButton();
    },
    loginForDev() {
      this.$refs.devRef.validate(async valid => {
        if (valid) {
          this.devForm.userId = this.EncryptUserId(this.devForm.userId);
          const res = await requestMethodGet("/web/system/devLogin", this.devForm);
          if (res) {
            this.setCookie("MSDPAuthorization", res.data.data, 3);
            if (res.data.code == 1000) {
              this.$router.push({ name: "LoginConfigure" });
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg
              });
            }
          }
        }
      });
    }
  },
  mounted() {
    this.setLoginOut();
    localStorage.setItem("backName", "/login");
    this.setLoginOut();
    if (this.$route.query.msg) {
      this.$message({
        type: "error",
        message: this.$route.query.msg
      });
      this.$router.push({
        path: this.$route.path,
        query: ""
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
  // background: #fef5f6;
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
  // box-shadow: 0px 0px 2px 0;
}
.login-out {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 40px;
  background: #fe000c;
  font-size: 16px;
}
.cover {
  object-fit: cover;
}
.dev-form {
  width: 80%;
  text-align: left;
  margin: 20px auto;
}
</style>

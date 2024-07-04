<template>
  <div class="nav-left" :style="mainminheight" v-loading="menuLoading">
    <div class="scroll_bar">
      <el-menu
        v-if="menuList.length"
        :router="true"
        :default-active="routeChange"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        style="height: 100%"
        unique-opened="true"
        active-text-color="red"
      >
        <div v-for="item in menuList" :key="item.menuId" style="padding: 1px 0;">
          <el-submenu :index="item.menuId" v-if="item.children.length && item.children[0].menuType == 'C'">
            <template slot="title">
              <img :src="item.icon" style="width: 20px; height: 20px; margin-right: 5px" />
              <span style="font-size: 16px">{{ item.menuName }}</span>
            </template>
            <el-menu-item v-for="value in item.children" :key="value.menuId" :index="value.frontUrl" style="font-size: 15px" @click.native="gioMenuTrack(value)">{{ value.menuName }}</el-menu-item>
          </el-submenu>
          <el-menu-item :index="item.frontUrl" v-else>
            <img :src="item.icon" style="width: 20px; height: 20px; margin-right: 5px" />
            <span slot="title" style="font-size: 16px" @click.native="gioMenuTrack(item)">{{ item.menuName }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 60}px`,
      menuLoading: false,
      newList: [],
      menuList: []
    };
  },
  computed: {
    routeChange() {
      if (this.$route.path.startsWith("/LoginConfigure")) {
        return "/LoginConfigure";
      } else if (this.$route.path.startsWith("/ServiceConfigure")) {
        return "/ServiceConfigure";
      } else if (this.$route.path.startsWith("/ComprehensiveConfigure")) {
        return "/ComprehensiveConfigure";
      } else if (this.$route.path.startsWith("/DealerProfile")) {
        return "/DealerProfile";
      } else if (this.$route.path.startsWith("/CustomerProfile")) {
        return "/CustomerProfile";
      } else if (this.$route.path.startsWith("/EquipmentProfile")) {
        return "/EquipmentProfile";
      } else if (this.$route.path.startsWith("/WorkOrderList")) {
        return "/WorkOrderList";
      } else if (this.$route.path.startsWith("/RoleList")) {
        return "/RoleList";
      } else if (this.$route.path.startsWith("/IotManagement")) {
        return "/IotManagement";
      } else if (this.$route.path.startsWith("/Notice")) {
        return "/Notice";
      } else if (this.$route.path.startsWith("/MenuList")) {
        return "/MenuList";
      } else if (this.$route.path.startsWith("/GoodsManagement")) {
        return "/GoodsManagement";
      } else if (this.$route.path.startsWith("/OrderManagement")) {
        return "/OrderManagement";
      } else if (this.$route.path.startsWith("/QrManagement")) {
        return "/QrManagement";
      } else if (this.$route.path.startsWith("/EnglishTranslation")) {
        return "/EnglishTranslation";
      } else if (this.$route.path.startsWith("/ServiceOrder")) {
        return "/ServiceOrder";
      } else if (this.$route.path.startsWith("/NewWorkOrderList")) {
        return "/NewWorkOrderList";
      } else if (this.$route.path.startsWith("/Train")) {
        return "/Train";
      } else if (this.$route.path.startsWith("/EquipmentLubrTable")) {
        return "/EquipmentLubrTable";
      } else if (this.$route.path.startsWith("/PortableTester")) {
        return "/PortableTester";
      }
      return this.$route.path;
    }
  },
  methods: {
    gioMenuTrack(menuItem) {
      this.$gio.clickNavMenuButton({
        menuName: menuItem.menuName
      });
    },
    // 获取功能按钮
    $_getBtnsList(val) {
      val.forEach(item => {
        if (item.menuType == "F") {
          this.newList.push(item);
        } else {
          if (item.children.length) {
            this.$_getBtnsList(item.children);
          }
        }
      });
      sessionStorage.setItem("btnPremissions", JSON.stringify(this.newList));
    },
    // 设置cookie
    setCookie(name, tokenId, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie = `${name}=${tokenId};path=/;expires=` + exdate.toGMTString();
    },
    // 处理数据，获取icon的全路径
    async handleIcon(array) {
      // const reqs = array.filter((item) => item.icon).map((item) => this.getFullUrl(item));
      // return new Promise.all(reqs)
      for (var i = 0; i < array.length; i++) {
        var data = array[i];
        if (data.icon) {
          this.getFullUrl(data);
        }
      }
    },
    // 获取图片全路径
    getFullUrl(val) {
      const params = {
        url: val.icon
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          val.icon = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 60}px`;
    });
    this.requestMethodGet("/web/system/permission/userManage/getUserMenu", {})
      .then(async res => {
        if (res.data.code == 1000) {
          const { data: userInfo } = res.data;
          this.$gio.SetUserId(userInfo.userId);
          this.$gio.user_info({
            userId: userInfo.userId,
            userType: "有账号用户"
          });
          this.$emit("msgCount");
          this.$emit("getMedal"); // 经销商荣誉勋章
          this.$emit("getUserEmail", res.data.data.email);
          this.$emit("getUserName", res.data.data.userName);
          if (res.data.data.menus && res.data.data.menus.length) {
            this.menuList = res.data.data.menus;
            await this.handleIcon(this.menuList);
            let userInfo = res.data.data;
            if (res.data.data.distributeCompanyNumber) {
              userInfo.distributeCompanyNumber = res.data.data.distributeCompanyNumber;
            }
            let fieldDtoList = res.data.data.fieldDtoList;
            sessionStorage.setItem("userInfo", this.Encrypt(JSON.stringify(userInfo)));
            sessionStorage.setItem("fieldDtoList", JSON.stringify(fieldDtoList));
            sessionStorage.setItem("menuList", JSON.stringify(this.menuList));
            Vue.prototype.$userInfo = userInfo;
            Vue.prototype.$isMobilAdmin = userInfo.accessTemplates.some(accessTemplate => accessTemplate.accessTemplateCode == "admin");
            /**
             * move sensitive data to cookie
             */
            // this.$cookies.set("userInfo", JSON.stringify(userInfo));
            this.$_getBtnsList(this.menuList);
            let path = "/" + this.$route.path.split("/")[1];
            let flag = false;
            this.menuList.forEach(item => {
              if (item.frontUrl && path.startsWith(item.frontUrl)) {
                flag = true;
              } else {
                if (item.children && item.children.length) {
                  item.children.forEach(res => {
                    if (res.frontUrl && path.startsWith(res.frontUrl)) {
                      flag = true;
                    }
                  });
                }
              }
            });

            if (this.menuList[0].children.length && this.menuList[0].children[0].menuType != "F") {
              // if (this.$route.path == "/success") {
              if (this.$route.path == "/toolkitTable") return;
              if (this.$route.path == "/toolkitChart") return;
              if (this.$route.path == "/userHelpDisplay") return;
              if (this.$route.path == "/EquipmentProfile/AddEquipmentProfile") return;
              if (this.$route.path == "/EquipmentProfile/EditEquipmentProfile") return;
              if (this.$route.path && flag) {
                window.onbeforeunload = e => {
                  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                  e.preventDefault();
                  return;
                };
              }
              if (!flag) {
                this.$router.push({
                  //核心语句
                  path: this.menuList[0].children[0].frontUrl //跳转的路径
                });
              }

              // }
            } else {
              if (this.$route.path == "/toolkitTable") return;
              if (this.$route.path == "/toolkitChart") return;
              if (this.$route.path == "/userHelpDisplay") return;
              if (this.$route.path == "/EquipmentProfile/AddEquipmentProfile") return;
              if (this.$route.path == "/EquipmentProfile/EditEquipmentProfile") return;
              if (this.$route.path == "/CustomerProfile/benefitReport") return;
              // if (this.$route.path == "/success") {
              if (this.$route.path && flag) {
                window.onbeforeunload = e => {
                  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                  return;
                };
              }
              if (!flag) {
                this.$router.push({
                  //核心语句
                  path: this.menuList[0].frontUrl //跳转的路径
                });
              }

              // }
            }
          } else {
            this.menuList = [];
            //跳转到无权限页面
            this.$router.push({
              //核心语句
              path: "/NoPermission" //跳转的路径
            });
          }
        } else {
          if (res.data.code == 3500) {
            this.$router.push({
              //核心语句
              path: "/login" //跳转的路径
            });
          }
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      })
      .catch(err => {
        //跳转到无权限页面
        // this.$router.push({  //核心语句
        //       path: '/login' //跳转的路径
        //   })
      })
      .finally(() => {
        this.$parent.refreshLoading = false;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.nav-left {
  box-sizing: border-box;
  width: 100%;
  .scroll_bar {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 5px !important;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(144, 147, 153, 0.3) !important;
    }
  }
  .mobil {
    color: #fff;
    text-align: center;
  }
  .el-menu {
    background: #f2f3f7 !important;
    border-right: none !important;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0;
    background-color: #fee7e8;
  }

  .el-icon-arrow-down:before {
    content: "\e790" !important;
  }
}
</style>

<!--
* @description 人员管理详情
* @fileName personnelDetail.vue
* @author vvx
* @date 2020/04/16 19:49:28
* @version V1.0.0
!-->
<template>
<div style="position:relative">
  <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer" >
      <el-button type="danger" plain size="small" @click="handleBack"><img src="../../assets/back.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">返回</el-button>
  </div>
  <div class="equipment-profile-detail" :style="mainminheight">
    <p class="equipment-profile-detail-title">头像</p>
    <img v-if="personnelnfo.headUrl" :src="personnelnfo.headUrl" class="avatar" />
    <p class="equipment-profile-detail-title">基本信息</p>
    <el-form
      :model="personnelnfo"
      ref="personnelnfo"
      label-width="100px"
      label-position="top"
      class="add-dealer-profile-personnelnfo"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名" prop="name">
            <span>{{personnelnfo.nameCn}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号">
            <span>{{personnelnfo.phone || '- -'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人员类型">
            <span v-if="personnelnfo.roleNames !==null">{{personnelnfo.roleNames}}</span>
            <span v-else>{{personnelnfo.userType ==1?'工程师':personnelnfo.userType==2?'内勤':'工业客户'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属公司">
            <span>{{personnelnfo.companyName || '- -'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="状态">
            <span>{{personnelnfo.state==1?'正常':'禁用'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮箱">
            <span>{{personnelnfo.email || '- -'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工编号">
            <span>{{personnelnfo.workNo || '- -'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建日期">
            <span>{{personnelnfo.createTime || '- -'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="footer">
      <el-button type="danger" @click="handleEdit" v-has='PEEditBtn' size="small">编辑</el-button>
      <!-- <el-button type="danger" plain @click="handleBack" size="small">返回</el-button> -->
    </div>
  </div>
 </div>
</template>

<script>
export default {
  data() {
    return {
      // 员工信息
      personnelnfo: {},
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`
    };
  },

  components: {},

  computed: {},
  created() {
    //     this.userNumber = this.$route.query.userNumber;
    this.$_queryPersonnelInfo(this.$route.query.userNumber); //查询人员详情
  },

  mounted() {},

  methods: {
    // 查询人员详情
    $_queryPersonnelInfo(userNumber) {
      let params = {
        userNumber
      };
      this.requestMethodGet("/web/user/userInfo", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.personnelnfo = res.data;
            this.personnelnfo.createTime = this.moment(
              new Date(this.personnelnfo.createTime)
            ).format("YYYY-MM-DD");
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    //编辑
    handleEdit() {
      if (this.$route.query.isSaveWoNumber) {
        this.$router.push({
          path: "/PersonnelList/EditPersonnel",
          query: {
            userNumber: this.$route.query.userNumber,
            isSaveWoNumber: true
          }
        });
      } else if (this.$route.query.isSaveCompanyNumber) {
        this.$router.push({
          path: "/PersonnelList/EditPersonnel",
          query: {
            userNumber: this.$route.query.userNumber,
            isSaveCompanyNumber: true
          }
        });
      } else {
        this.$router.push({
          path: "/PersonnelList/EditPersonnel",
          query: {
            userNumber: this.$route.query.userNumber
          }
        });
      }
    },
    // 返回
    handleBack(formName) {
      if (this.$route.query.isSaveWoNumber) {
        history.back(-1);
      } else if (this.$route.query.isSaveCompanyNumber) {
        history.back(-1);
      } else {
        this.$router.push({
          name: "PersonnelList",
          params: {
            isSaveQuery: true
          }
        });
      }
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        160}px`;
    }
  }
};
</script>
<style lang='less' scoped>
.equipment-profile-detail {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
  }
  &-base-info {
    padding: 20px 0;
    overflow: hidden;
  }
}
</style>
<style>
.equipment-profile-detail .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.equipment-profile-detail .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.equipment-profile-detail .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.equipment-profile-detail .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.equipment-profile-detail .el-form-item__label {
  color: #999999;
  padding: 0;
}
.equipment-profile-detail .el-tabs__nav-wrap::after {
  background: none;
}
.equipment-profile-detail .el-tabs__item.is-active {
  color: red;
}
.equipment-profile-detail .el-tabs__active-bar {
  background: red;
}
.equipment-profile-detail .el-form-item__label {
  color: #999999;
}
.footer {
  padding: 20px 0;
}
</style>
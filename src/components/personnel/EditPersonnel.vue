<!--
* @description 编辑人员
* @fileName EditPersonnel.vue
* @author vvx
* @date 2020/04/16 19:49:56
* @version V1.0.0
!-->
<template>
  <div class="equipment-profile-detail">
    <p class="equipment-profile-detail-title">头像</p>
    <img v-if="ruleForm.headUrl" :src="ruleForm.headUrl" class="avatar" />
    <p class="equipment-profile-detail-title">基本信息</p>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="100px"
      label-position="top"
      class="add-dealer-profile-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名" prop="name">
            <span>{{ruleForm.nameCn}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号">
            <span>{{ruleForm.phone || '- -'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人员类型">
            <span v-if="ruleForm.roleNames !==null">{{ruleForm.roleNames}}</span>
            <span v-else>{{ruleForm.userType ==1?'工程师':ruleForm.userType==2?'内勤':'工业客户'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属公司">
            <span>{{ruleForm.companyName || '- -'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select size="small" v-model="ruleForm.state" placeholder="--请选择--" style="width:80%;">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮箱" prop="email">
            <el-input size="small" v-model="ruleForm.email" autocomplete="off" style="width:80%;" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工编号">
            <el-input
              size="small"
              v-model="ruleForm.workNo "
              maxlength="15"
              autocomplete="off"
              style="width:80%;"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建日期">
            <span>{{ruleForm.createTime || '- -'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="footer">
      <el-button type="danger" @click="handleSubmit('ruleForm')" size="small">提交</el-button>
      <el-button type="danger" plain @click="handleCancle('ruleForm')" size="small">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      {
         let regEmail = new RegExp(
          "^([a-z0-9A-Z]+[^a-z]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$"
        );
        if (value && !regEmail.test(this.ruleForm.email)) {
          callback(new Error("邮箱格式不正确"));
        }
        callback();
      }
    };
    return {
      imgUrl: "", //图片
      // 表单验证
      ruleForm: {
        status: "",
        email: "",
        number: ""
      },
      statusList: [
        { value: "1", label: "正常" },
        { value: "0", label: "禁用" }
      ], //状态列表
      // 表单验证规则
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
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
            this.ruleForm = res.data;
             this.ruleForm.createTime = this.moment(
              new Date(this.ruleForm.createTime)
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
    //提交
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确定修改人员信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = {
                email: this.ruleForm.email,
                state: this.ruleForm.state,
                workNo: this.ruleForm.workNo,
                userNumber: this.ruleForm.userNumber
              };
              this.requestMethodPost("/web/user/updateUser", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    if (this.$route.query.isSaveQuery) {
                      this.$router.push({
                        name: "PersonnelList",
                        params: { isSaveQuery: true }
                      });
                    } else {
                      history.back(-1);
                    }
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    // 取消
    handleCancle(formName) {
      this.$refs[formName].resetFields();
       if (this.$route.query.isSaveQuery) {
        this.$router.push({
          name: "PersonnelList",
          params: { isSaveQuery: true }
        });
      } else {
        history.back(-1);
      }
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
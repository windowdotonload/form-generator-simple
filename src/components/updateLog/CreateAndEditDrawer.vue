<template>
  <el-drawer :title="'更新日志>'+title" :close-on-press-escape="false" :wrapperClosable="false" :visible.sync="drawerVis" direction="rtl" size="40%" :before-close="beforClose">
    <div class="drawer-content-container">
      <p style="margin-left:10px;font-weight:bold;">{{roleType}}</p>
      <el-form ref="ceDetailForm" :model="CEdetailForm" :rules="rules" label-width="100px" class="demo-ruleForm" style="width:95%;height:95%;">
        <el-form-item label="更新日期：" prop="renewDate">
          <el-date-picker
            prefix-icon='el-icon-date'
            clearable
            type="date"
            v-model="CEdetailForm.renewDate"
            placeholder="请选择"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新版本：" prop="renewVersion">
          <el-input v-model="CEdetailForm.renewVersion" clearable/>
        </el-form-item>
        <el-form-item label="更新内容：" prop="renewContent">
          <el-input v-model="CEdetailForm.renewContent" type="textarea" clearable :rows="10" maxlength="500" show-word-limit/>
        </el-form-item>
      </el-form>
      <div class="bottom-bar">
        <el-button @click="cancelCEdetail" size="mini">取消</el-button>
        <el-button @click="saveCEdetail" type="danger" size="mini">提交</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  inject: ["provide"],
  data() {
    return {
      title: "",
      opType: "",
      roleType: '',
      drawerVis: false,
      editQAItem: null,
      CEdetailForm: {
        target:0,
        renewDate: "",
        renewVersion: "",
        renewContent: ""
      },
      rules: {
        renewDate: [{ required: true, message: "请选择更新日期", trigger: "blur" }],
        renewVersion: [{ required: true, message: "请输入更新版本", trigger: "blur" }],
        renewContent: [{ required: true, message: "请输入更新内容", trigger: "blur" }]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.ceDetailForm.resetFields();
      this.CEdetailForm = {
        target:0,
        renewDate: "",
        renewVersion: "",
        renewContent: ""
      };
    },
    beforClose() {
      this.resetForm();
      this.editQAItem = null;
      this.drawerVis = false;
    },
    evokeDrawer(params) {
      this.title = params.title;
      this.opType = params.opType;
      this.roleType = params.roleType;
      this.CEdetailForm.target = params.target;
      if (params.editQAItem) {
        this.editQAItem = params.editQAItem;
        Object.keys(this.CEdetailForm).forEach(key => {
          this.CEdetailForm[key] = this.editQAItem[key];
        });

      }
      this.drawerVis = true;
    },
    cancelCEdetail() {
      this.$confirm("确认取消？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.resetForm((this.drawerVis = false));
        })
        .catch();
    },
    saveCEdetail() {
      this.$refs.ceDetailForm.validate(async valid => {
        if (valid) {
          const params = {
            ...this.CEdetailForm
          };
          let url = ''
          if (this.opType == "CREATE") { url = "updateLog/addUpdateLog" }
          if (this.opType == "EDIT") { params.id = this.editQAItem.id; url = "updateLog/editUpdateLog" }

          const res = await this.requestMethodPost(url, params);
          if (res.data.code == 1000) {
            this.$emit('confirmBack')
            this.resetForm();
            this.drawerVis = false;
          } else if (res.data.code == 2000){
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .el-drawer__header{
    margin-bottom: 10px;
  }
  .drawer-content-container {
    border-top: solid lightgray 1px;
    box-sizing: border-box;
    padding: 0 20px 0 20px;
    height: 80vh;
  }
  .bottom-bar {
    display: flex;
    justify-content: center;
  }
  .tip{
    color:#999;
    font-size:13px;
  }
</style>

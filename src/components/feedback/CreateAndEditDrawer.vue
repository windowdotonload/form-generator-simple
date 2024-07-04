<template>
  <el-drawer :title="'意见反馈>'+title" :close-on-press-escape="false" :wrapperClosable="false" :visible.sync="drawerVis" direction="rtl" size="40%" :before-close="beforClose">
    <div class="drawer-content-container">
      <el-form ref="ceDetailForm" :model="CEdetailForm" :rules="rules" label-width="150px" class="demo-ruleForm" style="width:95%;height:95%;">
        <el-form-item label="问卷星问卷链接：" prop="linkUrl">
          <el-input placeholder="将问卷星调研问卷链接放在此处" v-model="CEdetailForm.linkUrl" :disabled="title=='查看'"/>
          <div class="tip" style="margin-top:10px;">链接配置完成后，小程序上支持点击跳转到问卷填写页</div>
          <div class="tip">需要在第三方网页端进行配置，网页端地址：
            <a 
              href="https://survey.mobil.com.cn/corplogin.aspx"
              target="_blank"
              rel="noopener noreferrer"
              >https://survey.mobil.com.cn/corplogin.aspx</a>
          </div>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio v-model="CEdetailForm.status" :label="1" :disabled="title=='查看'">启用</el-radio>
          <el-radio v-model="CEdetailForm.status" :label="0" :disabled="title=='查看'">停用</el-radio>
        </el-form-item>
      </el-form>
      <div class="bottom-bar" v-show="title!=='查看'">
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
      drawerVis: false,
      editQAItem: null,
      CEdetailForm: {
        linkUrl: "",
        target: 0,
        status: 0
      },
      rules: {
        linkUrl: [{ required: true, message: "请输入问卷星问卷链接", trigger: "blur" }],
        target: [{ required: true, message: "请选择权限开放", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.ceDetailForm.resetFields();
      this.CEdetailForm = {
        linkUrl: "",
        target: 0,
        status: 0
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
          if (this.opType == "CREATE") { url = "feedback/addFeedback" }
          if (this.opType == "EDIT") { params.id = this.editQAItem.id; url = "feedback/updateFeedback" }

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
  .drawer-content-container {
    box-sizing: border-box;
    padding: 20px;
    padding-top: 0;
    height: calc(100vh - 80px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px !important;
    }
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

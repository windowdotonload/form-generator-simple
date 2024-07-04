<template>
  <el-drawer :title="title" :visible.sync="drawerVis" direction="rtl" size="43%" :before-close="beforClose">
    <div class="drawer-content-container">
      <el-form ref="ceDetailForm" :model="CEdetailForm" :rules="rules" label-width="180px" class="demo-ruleForm" style="width:85%">
        <el-form-item label="问题ID：">
          {{ CEdetailForm.number || "  —" }}
        </el-form-item>
        <el-form-item label="问：" prop="question">
          <el-input type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit v-model="CEdetailForm.question" :rows="5" />
        </el-form-item>
        <el-form-item label="答：" prop="answer">
          <el-input type="textarea" placeholder="请输入内容" maxlength="1000" show-word-limit v-model="CEdetailForm.answer" :rows="5" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio v-model="CEdetailForm.status" :label="true">启用</el-radio>
          <el-radio v-model="CEdetailForm.status" :label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="对谁可见：" prop="charge">
          <el-checkbox-group v-model="CEdetailForm.charge" @change="changeSelBox">
            <el-checkbox :label="-1" @click.stop.prevent.native="selAll">全部</el-checkbox>
            <el-checkbox :label="0">对美孚内部</el-checkbox>
            <el-checkbox :label="1">对经销商</el-checkbox>
            <el-checkbox :label="2">对经销商客户</el-checkbox>
            <el-checkbox :label="3">对直供客户</el-checkbox>
            <el-checkbox :label="4">对游客</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-form-item label="跳转链接：" prop="jumpFlag">
            <el-radio-group v-model="CEdetailForm.jumpFlag" @change="jumpFlagChange">
              <el-radio :label="0">不跳转</el-radio>
              <el-radio :label="1">MSDP内部链接</el-radio>
              <el-radio :label="2">H5页面</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="CEdetailForm.jumpFlag == 1 || CEdetailForm.jumpFlag == 2">
          <el-form-item label="链接按钮文案：" prop="linkContent">
            <el-input size="small" v-model="CEdetailForm.linkContent" maxlength="8" show-word-limit placeholder="请输入按钮文案" style="width:40%;"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="CEdetailForm.jumpFlag == 1">
          <el-form-item label="网页端菜单链接：" prop="linkUrl" :rules="[{ required: true, message: '请输入网页端菜单链接', trigger: 'blur' }]">
            <el-input size="small" v-model="CEdetailForm.linkUrl" placeholder="请输入网页端菜单链接" style="width:400px;"></el-input>
            <div>链接配置完成后，网页上支持点击跳转到对应的菜单</div>
          </el-form-item>
          <el-form-item label="小程序菜单路径：">
            <span slot="label"><span class="route_span">*</span>小程序菜单路径：</span>
            <el-select v-model="CEdetailForm.menuLv1" size="small" clearable placeholder="请选择一级菜单" style="width:140px;" @change="menuLv1Change">
              <el-option v-for="item in menuLv1List" :key="item.menuCode" :label="item.menuName" :value="item.menuCode"> </el-option>
            </el-select>
            <el-select v-model="CEdetailForm.menuLv2" size="small" :disabled="!CEdetailForm.menuLv1" clearable style="width:140px;" placeholder="请选择二级菜单" @change="menuLv2Change">
              <el-option v-for="item in menuLv2List" :key="item.serviceId" :label="item.serviceNameFull" :value="item.serviceId" :disabled="item.disabled"> </el-option>
            </el-select>
            <el-select
              v-model="CEdetailForm.menuLv3"
              size="small"
              :disabled="!CEdetailForm.menuLv2"
              clearable
              placeholder="请选择三级菜单"
              style="width:140px;"
              v-if="CEdetailForm.menuLv1 == 'function'"
              @change="change3"
            >
              <el-option v-for="item in menuLv3List" :key="item.serviceId" :label="item.serviceNameFull" :value="item.serviceId"> </el-option>
            </el-select>
            <div>路径配置完成后，小程序上支持点击跳转到具体功能页</div>
          </el-form-item>
        </el-row>
        <el-row v-if="CEdetailForm.jumpFlag == 2">
          <el-form-item label="URL：" prop="linkUrl" :rules="[{ required: true, message: '请输入URL', trigger: 'blur' }]">
            <el-input size="small" v-model="CEdetailForm.linkUrl" placeholder="请输入URL" style="width:400px;"></el-input>
            <div>链接配置完成后，小程序上支持点击跳转到对应的H5页面</div>
          </el-form-item>
        </el-row>
        <el-form-item label="图片：">
          <OSSUploadCombine fileType="knowledge_library" uploadType="image" v-model="CEdetailForm.picUrl" :limit="3" v-if="drawerVis" />
        </el-form-item>
        <el-form-item label="视频：">
          <OSSUploadCombine fileType="knowledge_library" uploadType="video" v-model="CEdetailForm.videoUrl" v-if="drawerVis" />
        </el-form-item>
        <el-form-item label="附件：">
          <OSSUploadCombine fileType="knowledge_library" uploadType="file" uploadBtnText="上传附件" v-model="CEdetailForm.attachmentUrl" v-if="drawerVis" />
        </el-form-item>
      </el-form>
      <div class="bottom-bar">
        <el-button @click="cancelCEdetail" size="mini">取消</el-button>
        <el-button @click="deleteCEdetail" plain type="danger" size="mini" v-if="opType == 'EDIT'">删除</el-button>
        <el-button @click="saveCEdetail" type="danger" size="mini">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { addUpdateLv3, deleteClassifyItem } from "../../../api/LubQA";

export default {
  inject: ["provide"],
  data() {
    return {
      title: "",
      opType: "",
      drawerVis: false,
      editQAItem: null,
      editCallback: null,
      allSelected: false,
      menuLv1List: [{ menuCode: "service", menuName: "服务" }, { menuCode: "function", menuName: "功能" }, { menuCode: "mine", menuName: "我的" }],
      menuLv2List: [],
      menuLv3List: [],
      serviceTypeList: [],
      CEdetailForm: {
        number: "",
        linkContent: "",
        menuLv1: "",
        menuLv2: "",
        menuLv3: "",
        linkUrl: "",
        question: "",
        answer: "",
        charge: [-1, 0, 1, 2, 3, 4],
        jumpFlag: 0,
        status: true,
        picUrl: [],
        videoUrl: [],
        attachmentUrl: []
      },
      rules: {
        question: [{ required: true, message: "请输入问题", trigger: "blur" }],
        answer: [{ required: true, message: "请输入答案", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        charge: [{ required: true, message: "请选择对谁可见", trigger: "blur" }],
        linkContent: [{ required: true, message: "请输入链接按钮文案", trigger: "blur" }],
        jumpFlag: [{ required: true, message: "请选择跳转链接", trigger: "blur" }]
      }
    };
  },
  methods: {
    jumpFlagChange(val) {
      if (val == 0) {
        this.CEdetailForm.linkContent = "";
        this.CEdetailForm.linkUrl = "";
        this.CEdetailForm.menuLv1 = "";
        this.CEdetailForm.menuLv2 = "";
        this.CEdetailForm.menuLv3 = "";
      }
      if (val == 1) {
        this.CEdetailForm.menuLv1 = "";
        this.CEdetailForm.menuLv2 = "";
        this.CEdetailForm.menuLv3 = "";
      }
      if (val == 2 || val == 3) {
        this.CEdetailForm.linkUrl = "";
      }
    },
    getMenuLevel2List() {
      this.requestMethodGet("/notice/getMenuDropDownList", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(it => {
            it.serviceId = it.menuIdLv1 + "," + it.menuIdLv2 + "," + it.menuIdLv3;
            it.disabled = it.statusLv3 ? false : true;
          });
          this.serviceTypeList = data;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    menuLv1Change(val) {
      this.getLv1List(val, "");
    },
    menuLv2Change(val) {
      this.getLv2List(val, "");
    },
    getLv1List(val, type) {
      if (type != "init") {
        this.CEdetailForm.menuLv2 = "";
        this.CEdetailForm.menuLv3 = "";
      }
      if (val == "service") {
        this.menuLv2List = this.serviceTypeList;
      } else if (val == "function") {
        this.menuLv2List = [
          { serviceId: "businessArchives", serviceNameFull: "业务档案", disabled: false },
          { serviceId: "servicePerformance", serviceNameFull: "服务履约", disabled: false },
          { serviceId: "serviceTools", serviceNameFull: "润滑服务工具", disabled: false },
          { serviceId: "utilities", serviceNameFull: "系统实用工具", disabled: false },
          { serviceId: "other", serviceNameFull: "其他", disabled: false }
        ];
      } else if (val == "mine") {
        this.menuLv2List = [
          { serviceId: "myTeam", serviceNameFull: "我的团队", disabled: false },
          { serviceId: "myService", serviceNameFull: "我的服务商", disabled: false },
          { serviceId: "qrcode", serviceNameFull: "邀请二维码管理", disabled: false },
          { serviceId: "userHelper", serviceNameFull: "系统使用小助手", disabled: false },
          { serviceId: "workshopView", serviceNameFull: "车间概览", disabled: false },
          { serviceId: "clause", serviceNameFull: "隐私条款", disabled: false },
          { serviceId: "updateLog", serviceNameFull: "版本更新日志", disabled: false },
          { serviceId: "feedback", serviceNameFull: "意见反馈", disabled: false },
          { serviceId: "officialAccount", serviceNameFull: "关注“美孚工业润滑油”公众号", disabled: false }
        ];
      }
    },
    getLv2List(val, type) {
      if (type != "init") {
        this.CEdetailForm.menuLv3 = "";
      }
      if (val == "businessArchives") {
        this.menuLv3List = [
          { serviceId: "customer", serviceNameFull: "客户" },
          { serviceId: "distributor", serviceNameFull: "经销商" },
          { serviceId: "workorder", serviceNameFull: "工单" },
          { serviceId: "device", serviceNameFull: "设备" },
          { serviceId: "service_apply_class", serviceNameFull: "申请单" },
          { serviceId: "PESpackage_wechat", serviceNameFull: "服务包" },
          { serviceId: "Task", serviceNameFull: "任务调度" },
          { serviceId: "abnormal", serviceNameFull: "异常记录" },
          { serviceId: "planArchives", serviceNameFull: "计划工程服务档案" }
        ];
      } else if (val == "servicePerformance") {
        this.menuLv3List = [{ serviceId: "function_service_report", serviceNameFull: "服务报告查询" }, { serviceId: "function_service_info", serviceNameFull: "服务介绍" }];
      } else if (val == "serviceTools") {
        this.menuLv3List = [
          { serviceId: "toolkit_calculate", serviceNameFull: "计算工具" },
          { serviceId: "competition", serviceNameFull: "对标产品与相容性查询" },
          { serviceId: "lubricationOnlineClass", serviceNameFull: "润滑知识学堂" },
          { serviceId: "device_file", serviceNameFull: "设备资料管理" },
          { serviceId: "my-ymf-btn", serviceNameFull: "易美孚" },
          { serviceId: "product-manual", serviceNameFull: "产品手册" },
          { serviceId: "lubKnowledge", serviceNameFull: "润滑常见问答" },
          { serviceId: "caseInquiry", serviceNameFull: "客户案例查询" },
          { serviceId: "fdApply", serviceNameFull: "FD配方披露申请" }
        ];
      } else if (val == "utilities") {
        this.menuLv3List = [
          { serviceId: "function_invitate", serviceNameFull: "邀请" },
          { serviceId: "scan_equipment", serviceNameFull: "扫描设备" },
          { serviceId: "assistant", serviceNameFull: "系统使用小助手" },
          { serviceId: "loginPC", serviceNameFull: "登录PC" }
        ];
      } else if (val == "other") {
        this.menuLv3List = [
          { serviceId: "serviceApply", serviceNameFull: "服务申请" },
          { serviceId: "health", serviceNameFull: "健康中心" },
          { serviceId: "todoTask", serviceNameFull: "待办中心" },
          { serviceId: "statistic", serviceNameFull: "数据统计" }
        ];
      }
    },
    selAll(e) {
      this.allSelected = !this.allSelected;
      if (this.allSelected) {
        this.CEdetailForm.charge = [0, 1, 2, 3, -1, 4];
      } else {
        this.CEdetailForm.charge = [];
      }
    },
    changeSelBox(val) {
      if (val.includes(0) && val.includes(1) && val.includes(2) && val.includes(3) && val.includes(4)) {
        this.CEdetailForm.charge.push(-1);
      } else {
        const index = this.CEdetailForm.charge.indexOf(-1);
        if (index >= 0) this.CEdetailForm.charge.splice(index, 1);
      }
    },
    resetForm() {
      this.$refs.ceDetailForm.resetFields();
      this.CEdetailForm = {
        number: "",
        linkContent: "",
        menuLv1: "",
        menuLv2: "",
        menuLv3: "",
        linkUrl: "",
        question: "",
        answer: "",
        charge: [-1, 0, 1, 2, 3, 4],
        jumpFlag: 0,
        status: true,
        picUrl: [],
        videoUrl: [],
        attachmentUrl: []
      };
    },
    beforClose() {
      this.resetForm();
      this.editQAItem = null;
      this.drawerVis = false;
      this.editCallback = null;
    },
    evokeDrawer(params) {
      console.log(params);
      this.getMenuLevel2List(); // 获取二级菜单
      this.title = params.title;
      this.opType = params.opType;
      if (params.editQAItem) {
        this.editQAItem = params.editQAItem;
        if (!this.editQAItem.jumpFlag) {
          this.editQAItem.jumpFlag = 0;
        }
        if (params.editCallback) this.editCallback = params.editCallback;
        // Object.keys(this.CEdetailForm).forEach( key => {
        //    this.CEdetailForm[key] = this.editQAItem[key];
        // });
        this.CEdetailForm = this.editQAItem;

        if (!this.CEdetailForm.menuLv1) {
          console.log(888888);
          this.CEdetailForm.menuLv1 = "";
        }
        if (this.CEdetailForm.jumpFlag == 1) {
          if (this.CEdetailForm.menuLv1 !== "") {
            this.getLv1List(this.CEdetailForm.menuLv1, "init");
          }
          if (this.CEdetailForm.menuLv1 == "function" && this.CEdetailForm.menuLv2 !== "") {
            this.getLv2List(this.CEdetailForm.menuLv2, "init");
          }
        }
        if (this.editQAItem.menuLv1 == "service") {
          let allServiceId = [];
          this.serviceTypeList.forEach(item => {
            allServiceId.push(item.serviceId);
          });
          if (!allServiceId.toString().includes(this.editQAItem.menuLv2)) {
            this.CEdetailForm.menuLv2 = "";
          }
        }
        if (!this.CEdetailForm.menuLv2) {
          this.CEdetailForm.menuLv2 = "";
        }
        if (!this.CEdetailForm.menuLv3) {
          this.CEdetailForm.menuLv3 = "";
        }

        this.CEdetailForm.charge = this.CEdetailForm.charge.split(",").map(item => Number(item));
        this.CEdetailForm.picUrl = this.CEdetailForm.picUrl && this.CEdetailForm.picUrl.split(",");
        this.CEdetailForm.videoUrl = this.CEdetailForm.videoUrl && this.CEdetailForm.videoUrl.split(",");
        this.CEdetailForm.attachmentUrl = this.CEdetailForm.attachmentUrl && this.CEdetailForm.attachmentUrl.split(",");
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
    deleteCEdetail() {
      this.$confirm("确认删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const params = {
            level: 3,
            id: this.editQAItem.id
          };
          const res = await deleteClassifyItem(params);
          if (this.$parent.refreshLv3List) this.$parent.refreshLv3List();
          if (this.editCallback) this.editCallback();
          this.beforClose();
        })
        .catch();
    },
    saveCEdetail() {
      let flag = false;
      console.log(this.CEdetailForm.jumpFlag);
      if (this.CEdetailForm.jumpFlag == 1) {
        if (this.CEdetailForm.menuLv1 == "") {
          flag = true;
          this.$message({
            message: "请选择一级菜单路径",
            type: "warning"
          });
        } else if (this.CEdetailForm.menuLv2 == "") {
          flag = true;
          this.$message({
            message: "请选择二级菜单路径",
            type: "warning"
          });
        } else if (this.CEdetailForm.menuLv1 == "function" && this.CEdetailForm.menuLv3 == "") {
          flag = true;
          this.$message({
            message: "请选择三级菜单路径",
            type: "warning"
          });
        }
      }
      if (flag) return;
      this.$refs.ceDetailForm.validate(async valid => {
        if (valid) {
          this.CEdetailForm.charge = this.CEdetailForm.charge.join(",");
          this.CEdetailForm.picUrl = this.CEdetailForm.picUrl && this.CEdetailForm.picUrl.map(item => item.halfPath).join(",");
          this.CEdetailForm.videoUrl = this.CEdetailForm.videoUrl && this.CEdetailForm.videoUrl.map(item => item.halfPath).join(",");
          this.CEdetailForm.attachmentUrl = this.CEdetailForm.attachmentUrl && this.CEdetailForm.attachmentUrl.map(item => item.halfPath).join(",");
          const params = {
            ...this.CEdetailForm
          };
          if (this.opType == "CREATE") params.idLv2 = this.provide.lv2CatalogueItem.id;
          if (this.opType == "EDIT") params.id = this.editQAItem.id;

          const res = await addUpdateLv3(params);
          if (res.data.code == 1000) {
            if (this.$parent.refreshLv3List) this.$parent.refreshLv3List();
            if (this.editCallback) this.editCallback();
            this.resetForm();
            this.drawerVis = false;
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
.route_span {
  margin: 6px 3px 0 0;
  display: inline-block;
  color: red;
}
.bottom-bar {
  display: flex;
  justify-content: flex-end;
}
</style>

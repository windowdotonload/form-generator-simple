<template>
  <div>
    <div class="foot-botton">
      <el-button type="danger" plain :disabled="!disabledPreview" @click="previewReport" size="small">预览报告</el-button>
      <el-button type="danger" v-if="publishStatus == 0" plain @click="saveInfoDraft" size="small">保存草稿</el-button>
      <el-button type="danger" @click="saveInfoPublish" size="small">保存并发布</el-button>
      <el-button type="danger" plain @click="cancleEditInfo" size="small">取消</el-button>
    </div>
    <!-- 完结工单 -->
    <el-dialog title="提示" class="closeWorkOrder" :visible.sync="finishWorkorder" :show-close="true" width="30%">
      <div style="font-size: 14px; color: #666; ">
        是否发布服务报告并完成工单
      </div>
      <div slot="footer"  style="display: flex;justify-content: space-between;">
        
          <el-button  plain @click="cancelDialog()" size="small">取消</el-button>
        
        <div>
          <el-button type="danger" plain @click="onPublishAndFinish()" size="small">发布并完成工单</el-button>
          <el-button type="danger" @click="onlyPublishOne()" size="small">仅发布报告</el-button>
        </div>
      </div>
    </el-dialog> 
    <el-dialog title="提示" class="closeWorkOrder" :visible.sync="finishAllWorkorder" :show-close="true" width="30%">
      <div style="font-size: 14px; color: #666; ">
        当前服务报告完成后，当前工单和服务申请均可完结，是否同步完成？
      </div>
      <div slot="footer"  style="display: flex;justify-content: space-between;">
        <el-button plain @click="cancelFinishApply()" size="small">取消</el-button>
        <div>
          <el-button  type="danger" plain @click="finishApply()" size="small">发布并完成服务</el-button>
          <el-button type="danger" plain @click="finishOrder()" size="small">完成工单</el-button>
          <el-button type="danger" @click="onlyPublish()" size="small">仅发布报告</el-button>
        </div>
      </div>
    </el-dialog> 
    <el-dialog title="补全申请单信息" class="closeWorkOrder" :visible.sync="applyMsgDialog" :show-close="true" width="30%">
      <div style="font-size: 14px; color: #666;margin-top: 20px; ">
        <i class="el-icon-warning" style="color:rgb(255,153,0);font-size: 15px;margin-right:4px;" ></i>申请单必填信息缺失，参数化报告和工单可完成，请编辑申请单并补全信息后，重新尝试完结申请单
      </div>
      <div slot="footer">
          <el-button plain @click="cancelFinishApplyDialog()" size="small">取消</el-button>
          <el-button  type="danger" plain @click="GoToReplenish()" size="small">前往补全</el-button>
      </div>
    </el-dialog> 
  </div>
  
  
</template>
<script>
import validateForm from "@/components/businessComponents/components/validateForm";
import { reportParamSimplify } from '@/components/businessComponents/components/report-param-simplify'
export default {
  mixins: [validateForm],
  props: {
    draftJsonDtoList: {
      type: Array,
      default: []
    },
    reportObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      disabledPreview: true,
      publishStatus: 0,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      validateItemList: [],
      dropdown5List:[],
      finishAllWorkorder:false,  // 是否同步完成服务申请弹框
      finishWorkorder:false,
      applyMsgDialog:false,
    };
  },
  watch: {
    draftJsonDtoList: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.draftJsonDtoList = val;
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.publishStatus = this.$route.query.publishStatus;
    this.queryReportStatus("first");
  },
  mounted() {},
  methods: {
    // 预览
    previewReport() {
      this.queryReportStatus();
    },
    // 调取报告详情接口
    queryReportStatus(val) {
      const params = {
        draftId: this.$route.query.draftId
      };
      this.requestMethodPost("/serviceReport/currentStatus", params).then(res => {
        if (res.data.code == 1000) {
          this.$gio.Track("previewServiceReport_workorder", {
            workorderNumber: this.$route.query.workorderNumber,
            serviceType: this.$route.query.serviceType
          });
          if (res.data.data.status == "0") {
            this.disabledPreview = false;
          }
          if (res.data.data.status == "1" && val != "first") {
            window.open(res.data.data.reportFileUrl);
          }
          if (res.data.data.status == "2" && val != "first") {
            this.$message({
              message: "报告正在生成中，请稍后",
              type: "warning"
            });
          }
          if (res.data.data.status == 3 && val != "first") {
            this.$message({
              message: "报告生成失败，请重试",
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 保存草稿
    saveInfoDraft(needTip) {
      this.$gio.Track("saveDraftOfServiceReport", {
        workOrderNumber: this.$route.query.workOrderNumber,
        serviceType: this.$route.query.serviceType
      });
      // 清空油品下拉的数据
      if(this.reportObj.reportType == 15){
        this.draftJsonDtoList[2].nodeValue[2].fieldOption = [] 
      }
      if(this.reportObj.reportType == 16){
        this.draftJsonDtoList[4].nodeValue[4].fieldOption = [] 
      }
      const { valueDtoList, lubricationPointNumberList }  = reportParamSimplify(JSON.parse(JSON.stringify(this.draftJsonDtoList)))
      const params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        saveAndPublish: false, // 最终保存为true，中途返回为fasle
        draftId: this.$route.query.draftId,
        deviceNumber: this.reportObj.deviceNumber,
        lubricationPointNumber: [...new Set([...lubricationPointNumberList,this.reportObj.lubricationPointNumber])].join(','),
        userId: this.userInfo.userId,
        valueDtoList: valueDtoList,
        authorization:this.getCookie()
      };
      this.requestMethodPost("/serviceReport/saveTemplateDetail", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.disabledPreview = true;
            if (!needTip) return;
            this.$message({
              message: "报告草稿已保存",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {});
    },
    // 保存并发布
    saveInfoPublish() {
      this.$gio.Track("releaseServiceReport", {
        workOrderNumber: this.$route.query.workOrderNumber,
        servcieeType: this.$route.query.serviceType
      });
      let validateArr = [];
      this.draftJsonDtoList.forEach(it => {
        validateArr.push(...it.nodeValue);
      });
      // const flag = this.validateFormItem(validateArr);
      // if (!flag) return;
      if(this.reportObj.reportType == 2){
        let checkOilForm = []
        this.draftJsonDtoList.forEach(it => {
          if(it.isImportFile){
            checkOilForm.push(...it.nodeValue)
          }
        })
        let indexValue  =  checkOilForm.findIndex((value)=>value.name=='导入的数据')
        if(!checkOilForm[indexValue].children.length){
          this.$message({
            message:'请导入验油数据',
            type:'warning'
          })
          return
        }
      }
      // 清空油品下拉的数据
      if(this.reportObj.reportType == 15){
        this.draftJsonDtoList[2].nodeValue[2].fieldOption = [] 
      }
      if(this.reportObj.reportType == 16){
        this.draftJsonDtoList[4].nodeValue[4].fieldOption = [] 
      }
      this.checkHandleWorkOrder()
      
    },
    // 判断登录人是否为工单所属申请单的负责人   以及 除工单外是否有未完成的工单
    checkHandleWorkOrder() {
      let param = {
        workOrderNumber:this.$route.query.workOrderNumber,
        serviceApplyOrderId:this.$route.query.serviceApplyOrderId,
        reportType:this.reportObj.reportType,
        operationEntrance:1,
        draftId:this.$route.query.draftId,
        coreDataStatus:this.$route.query.coreDataStatus,
        coreDataTemplateId:this.$route.query.coreDataTemplateId
      }
      this.requestMethodGet("/weChat/workOrder/checkHandleWorkOrder", param)
        .then(res => {
          console.log(res.data.code)
          // 1000 登录人是工单所属申请单的负责人   以及 除工单外没有未完成的工单
          if(res.data.code==1000) {
            this.finishAllWorkorder = true;  
          }else if (res.data.code==6003) {    // 6003 登录人不是工单所属申请单的负责人
            this.finishWorkorder = true;
          }else if (res.data.code==6004) {
            this.finishWorkorder = true;
          }else if (res.data.code==6002) {
            this.submitSaveReport('')
          }else if (res.data.code==9600) {
            if (this.reportObj.publishStatus == 1) {
              this.$confirm("新生成的文件将覆盖当前发布的文件，是否继续操作？", "保存并发布", {
                confirmButtonText: "覆 盖",
                cancelButtonText: "取消"
              })
                .then(() => {
                  this.submitSaveReport('againReport')
                })
                .catch(() => {});
            } else {
              this.submitSaveReport('onlyReport')
            }
          }else { 
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
           this.$message({
            message: res.msg,
            type: "warning"
          });
        });
    },
    cancelDialog() {
      this.finishWorkorder = false
    },
    cancelFinishApply() {
      this.finishAllWorkorder = false
    },
     // 发布并完成服务
    onPublishAndFinish() {
      this.submitSaveReport('publishAndFinish')
    },
    // 取消
    cancelFinishApplyDialog() {
      this.applyMsgDialog = false
    },
    // 前往补充申请单信息 并发布报告和完结工单
    GoToReplenish() {
      this.submitSaveReport('onlyOrder')
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: this.$route.query.serviceApplyOrderId
        }
      });
    },
    // 发布并完成服务
    finishApply() {
      let param = {
        id:this.$route.query.serviceApplyOrderId
      }
      this.requestMethodPost("/serviceApply/serviceApplyOrderIntegrityCheck", param)
        .then(res => {
          console.log(res.data.code)
          // 1000 登录人是工单所属申请单的负责人   以及 除工单外没有未完成的工单
          if(res.data.code==1000) {
            this.submitSaveReport('finishApply')
          }else if(res.data.code==2000){ 
            this.applyMsgDialog = true
          }else { 
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
           this.$message({
            message: res.msg,
            type: "warning"
          });
        });
      // 
    },
    //  完成工单
    finishOrder() {
      this.submitSaveReport('order')
    },
    onlyPublishOne() {
      this.submitSaveReport('onlyPublishOne')
    },
    //  仅发布报告
    onlyPublish() {
      this.submitSaveReport('publish')
    },
    submitSaveReport(val) {
      const { valueDtoList, lubricationPointNumberList }  = reportParamSimplify(JSON.parse(JSON.stringify(this.draftJsonDtoList)))
      const params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        saveAndPublish: true, // 最终保存为true，中途返回为fasle
        draftId: this.$route.query.draftId,
        deviceNumber: this.reportObj.deviceNumber,
        lubricationPointNumber: [...new Set([...lubricationPointNumberList,this.reportObj.lubricationPointNumber])].join(','),
        userId: this.userInfo.userId,
        valueDtoList: valueDtoList,
        serviceApplyOrderId:this.$route.query.serviceApplyOrderId,
        authorization:this.getCookie()
      };
      if(val=='finishApply') {
        params.completedPublish = 1
      }
      if(val=='order' || val=='publishAndFinish' || val=='onlyOrder') {
        params.completedPublish = 2
      }
      this.requestMethodPost("/serviceReport/saveTemplateDetail", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "服务报告发布成功",
            type: "success"
          });
          if(val=='finishApply' || val=='order' || val=='publish') {
            this.finishAllWorkorder = false
            this.$router.go(-1);
          }
          if(val=='againReport' || val=='onlyReport') {
            this.$router.go(-1);
          }
          if(val=='onlyOrder') {
            this.applyMsgDialog = false
          }
          if(val=='publishAndFinish' || val=='onlyPublishOne') {
            if(val=='publishAndFinish') {
              this.$gio.completeWorkorder({
                operation: "发布报告并完成"
              });
            }
            this.finishWorkorder = false
            this.$router.go(-1);
          }
          
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消
    cancleEditInfo() {
      this.$confirm("取消后将丢失本次编辑内容", "取消编辑", {
        cancelButtonText: "继续编辑",
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.foot-botton {
  width: 100%;
  background-color: #fff;
  height: 50px;
  position: fixed;
  bottom: 0;
}
/deep/ .closeWorkOrder {
    .el-dialog__header .el-dialog__title{
      color: #000;
      font-weight: 400;
      font-size: 18px;
    }
    .el-dialog__body {
      padding:0px 20px 10px;
    }
  }
</style>

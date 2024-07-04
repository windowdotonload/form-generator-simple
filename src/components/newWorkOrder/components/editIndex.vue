<template>
  <div style="display: flex;flex-direction: column;border: 1px solid #e9e9e9;padding: 16px;border-radius: 6px;">
    <div v-for="(nodeItem,nodeIndex) in nodeList" :key="nodeKey">
      <serviceReportForEdit
      :nodeItem="nodeItem"
      :isEditFlag="isEditFlag"
      :paramReportNode="nodeList"
      :reportType="reportType"
      ></serviceReportForEdit>
    </div>
    <div style="font-size: 14px;color:#333color: #000;font-weight: 400;font-family: MicrosoftYaHei;margin:20px 0;display: flex;
    align-items: center;" v-if="reportType">
      <span class="star">*</span>报告
      <el-upload
        v-if="isEditFlag"
        v-has="PC_WorkOrder_uploadcorereport"
        class="upload-demo"
        multiple
        :limit="10"
        :auto-upload="false" 
        :show-file-list="false"
        accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
        :on-change="file => handleAddFile(file)">
        <el-button size="small" type="danger" plain >点击上传</el-button>
      </el-upload>
    </div>
    <!-- 报告列表 -->
    <div class="list-content" v-for="(item, index) in sysAttachmentList" :key="index">
      <div style="width:90%">
        <div class="report-title">{{ item.attachmentFileName }}</div>
        <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
          <div>上传人：{{ item.createUserName }}</div>
          <div class="content-line"></div>
          <div>创建时间：{{ item.createTime }}</div>
        </div>
      </div>
      <div>
        <el-link style="margin-right:10px" @click="previewBenefitReport(item)">预览</el-link>
        <el-link style="color:#dd0000;" @click="deleteBenefitReport(item)"  v-if="isEditFlag">删除</el-link>
      </div>
    </div>
    <el-button type="danger" size="small" @click="saveInfo" class="save-info-btn" v-if="reportType && isEditFlag">保存</el-button>
  </div>
</template>

<script>
import serviceReportForEdit from '@/components/newWorkOrder/components/serviceReportForEdit'
import OSSClient from "../../../utils/ossClient";
import { fullScreen_loading } from "../../../generalComponents/fullScreenLoading";
import validateForm from "@/components/businessComponents/components/validateForm";
const oss_client = new OSSClient();
export default {
  mixins:[validateForm],
  components:{ serviceReportForEdit },
  props:{
    workOrderNumber:{
      type:String,
      default:''
    },
    sysAttachmentList:{
      type:Array,
      default:[]
    },
    isEditFlag:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      nodeList:[],
      reportType:'',
      userInfo:JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      draftId:null,
      nodeKey:1
    }
  },
  watch:{
    workOrderNumber:{
      handler:function(val,oldVal){
        if(val){
          this.getTemplateData()
        }
      },
      immediate: true
    }
  },
  created(){
    console.log('isEditFlag',this.isEditFlag)
  },
  methods:{
    getTemplateData(){
      this.requestMethodGet('/web/workOrder/getCoreDataOfWorkOrder',{workOrderNumber:this.workOrderNumber}).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data.draftDetailJsonDtoList
          const { reportType,sysAttachmentList} = res.data.data
          data.forEach(it=>{
            it.nodeValue.forEach(item=>{
              if(item.name.includes('润滑点信息')){
                it.isLup = true
                item.children.forEach(lup=>{
                  lup.isGroup = (lup.nameKey == 'lup_name' || lup.nameKey == 'lup_current_oil' || lup.nameKey == 'lup_oil_change_period' || lup.nameKey=='lup_oil_add_period')
                })
              }else{
                it.isLup = false
              }
            })
          })
          if(sysAttachmentList && sysAttachmentList.length){
            sysAttachmentList.forEach(it=>{
              it.uid = _.uniqueId("file_");
            })
          }
          this.sysAttachmentList = sysAttachmentList
          this.nodeList = data
          this.reportType = reportType
          this.draftId = res.data.data.id ? res.data.data.id : null
          this.$emit('getCoreInfoId',this.draftId)
          this.$emit('uploadSuccess',this.sysAttachmentList)
          ++this.nodeKey
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 上传报告
    async handleAddFile(file) {
      const fileType = file.name.split(".")[file.name.split(".").length - 1];
      const canUploadFileType=['doc','docx','pdf','ppt','pptx','xls','xlsx']
      const limitSze = file.size / 1024 / 1024 < 100;
      if (!limitSze) {
        this.$message({
          type: "warning",
          message: "上传失败，请上传100M以内的文件"
        });
        return;
      }
      if (!canUploadFileType.includes(fileType)) {
        this.$message({
          type: "warning",
          message: "只能上传pdf / word / excel / ppt 类型文件"
        });
        return;
      }else if(this.sysAttachmentList.length>9){
        this.$message({
          type: "warning",
          message: "最多上传10个文件"
        });
        return;
      } else {
        fullScreen_loading.LOADING();
        await oss_client.getOSSClientInstance("work_order_core_data_file");
        const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name);
        let obj = {};
        obj.attachmentFileName = file.name;
        obj.attachmentHalfUrl = uploadFileRes.name;
        obj.createUserName = this.userInfo.userName;
        obj.createTime = this.formatDate(new Date());
        obj.uid = _.uniqueId("file_");
        this.sysAttachmentList.push(obj)
        fullScreen_loading.ENDLOADING();
        this.$emit('uploadSuccess',this.sysAttachmentList)
      }
    },
    bindWorkOrder(val){
      console.log(val)
      let filePath = []
      this.sysAttachmentList.forEach(it=>{
        filePath.push(it.attachmentHalfUrl)
      })
      const params = {
        attachmentKey:this.workOrderNumber,
        attachmentType:'work_order_core_data_file',
        attachmentUrls:filePath
      }
      this.requestMethodPost('/weChat/common/uploadSysAttachment',params).then(res=>{
        this.$emit('saveSuccess',res.data.data,val)
        if(res.data.code != 1000){
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    async previewBenefitReport(item){
      if(!item.attachmentUrl){
        window.open(await this.getFileUrl(item.attachmentHalfUrl))
      }else{
        window.open(item.attachmentUrl)
      }
    },
    async getFileUrl(halfPath){
      const res = await this.requestMethodGet('/web/file/getFullUrl', {
        url: halfPath
      })
      if (res.data.code == 1000) {
        return Promise.resolve(res.data.data)
      } else {
        this.$message({
          type: 'warning',
          message: '获取全路径失败，请稍后重试。'
        })
      }
    },
    deleteBenefitReport(item){
      this.sysAttachmentList.forEach((it,index)=>{
        if(it.uid == item.uid){
          this.sysAttachmentList.splice(index,1)
        }
      })
    },
    validateNode(){
      let validateArr = [];
      this.nodeList.forEach(it => {
        validateArr.push(...it.nodeValue);
      });
      const flag = this.validateFormItem(validateArr,false);
      return flag
    },
    saveInfo(val){
      let validateArr = [];
      this.nodeList.forEach(it => {
        validateArr.push(...it.nodeValue);
      });
      const flag = this.validateFormItem(validateArr,false);
      if (!flag) return;
      if(!this.sysAttachmentList.length){
        this.$message({
          type:'warning',
          message:'请上传报告'
        })
        return
      }
      const params = {
        draftId:this.draftId,
        workOrderNumber:this.workOrderNumber,
        coreDataStatus:2,
        valueDtoList:this.nodeList
      }
      this.requestMethodPost('/web/workOrder/saveCoreDataOfWorkOrder',params).then(res=>{
        if(res.data.code == 1000){
          if(val != 'parent'){
            this.$message({
              type:'success',
              message:'保存成功'
            })
          }
          console.log(val)
          this.bindWorkOrder(val)
          this.getTemplateData()
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.save-info-btn{
  margin: 20px 0  16px 0;
  width: 60px;
}
.star {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 2px;
}
.list-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  border: 1px solid rgba(204, 221, 255, 0.5);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: rgba(204, 221, 255, 0.3);
}
.report-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-line {
  height: 14px;
  width: 1px;
  background-color: #e9e9e9;
  margin: 0 10px;
}
</style>
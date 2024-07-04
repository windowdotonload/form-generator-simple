<template>
<div style="position:relative;background: #f2f3f6;">
  <div class="top-btn-content">
      <el-button plain size="small" @click="cancelCreate" 
      v-auth="{ 
        menuCodes:'Excellentcase_Cancel', 
        strategyNames:['personal'],
        strategySource:{
          personal:userInfo.userId
        }
      }">取消</el-button>
      <el-button plain size="small"
       @click="saveDraft" 
       v-auth="{ 
        menuCodes:'Excellentcase_Savedraft', 
        strategyNames:['personal'],
        strategySource:{
          personal:userInfo.userId
        }
      }">保存草稿</el-button>
      <el-button type="danger" 
      size="small" 
      @click="submitCase('activityRef')"
      v-auth="{ 
        menuCodes:'Excellentcase_Submit', 
        strategyNames:['personal'],
        strategySource:{
          personal:userInfo.userId
        }
      }">提交</el-button>
    </div>
  <div class="case-create-content" :style="mainminheight">
    <!-- 头部信息 -->
    <div class="create-header">
      <div class="status">待提报</div>
      <el-form :model="createForm" label-position="top" label-width="120px" inline>
        <el-row>
          <el-col :span="3">
            <el-form-item label="案例编号">
              <div>{{pageType=='add'?'-':headInfo.caseNo}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="服务商">
              <div>{{pageType=='add'?createHeadInfo.distributorCompanyName:headInfo.spName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户名称">
              <div>{{pageType=='add'?createHeadInfo.customerName:headInfo.accountName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="提报人">
              <div>{{pageType=='add'?createHeadInfo.createUserName:headInfo.userName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提报时间">
              <div>{{pageType=='add'?'-':headInfo.commitTime}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
    </div>
    <div class="create-content" style="display: -webkit-box;">
      <!-- 左侧附件 -->
      <div class="left-content">
        <div class="file-header">
          <div class="title-content flex-w"><div class="line"></div>上传支持性材料 </div>
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="false"
            :on-remove="handleRemove"
            :on-change="(file, fileList) => handleUploadFile(file, fileList)"
          >
            <el-button size="small" type="danger">点击上传</el-button>
          </el-upload>
        </div>
        <!-- 文件列表 -->
        <div class="file-content" v-for="(item,index) in attachmentFileList" v-if="attachmentFileList.length>0">
          <div class="flex-w">
            <img src="../../assets/case_create_file.png"  style="width:14px;height:14px">
            <div style="margin-left:8px;color:#666666;width: 180px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.fileName}}</div>
          </div>
          <div class="flex-w" style="font-size:13px">
            <el-link :underline="false" style="color:#001450" @click="viewFile(item)">查看</el-link>
            <el-link :underline="false" style="color:#DD0000;margin-left:10px" @click="deleteFile(item)">删除</el-link>
          </div>
        </div>

        <!-- 暂无数据 -->
        <div style="display: flex;align-items: center;flex-direction: column;" v-if="attachmentFileList.length==0">
          <img src="../../assets/empty_file.png" style="width:160px;height:160px">
          <div style="font-size:13px;color:#999">暂无附件</div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-content" id="rightContent">
        <!-- 活动 -->
        <div class="right-card-content" style="margin-top:0">
          <div class="file-header">
            <div class="title-content flex-w"><div class="line"></div>活动</div>
          </div>
          <el-form :model="activityForm" :rules="activityRules" ref="activityRef" label-width="80px">
            <el-form-item label="活动标题" prop="activityId">
              <el-select v-model="activityForm.activityId" placeholder="请选择" size="small" multiple collapse-tags clearable @change="activityTitleChange" style="width:300px">
                <el-option
                  v-for="item in titleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动简介">
              <!-- <el-input size="small" type="textarea" v-model="activityRules.activityDesc" clearable maxlength="500" show-word-limit disabled :rows="6"></el-input> -->
              <div v-if="!activityDescList.length">-</div>
              <div v-for="it in activityDescList" v-else>
                <div>{{it.title}}：</div>
                <div>{{it.desc}}</div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 工单明细 -->
        <div class="right-card-content">
          <div class="file-header">
            <div class="title-content flex-w"><div class="line"></div>工单明细</div>
          </div>
          <div style="display:flex;align-items:center;margin:16px 0">
            <div class="flex-w">
              <div class="order-contnet detail-title">所属申请单</div>
              <el-link type="primary" @click="toServiceApplyDetail">{{workOrderDetail.serviceApplyNo}}</el-link>
            </div>
            <div class="flex-w"  style="margin-left:48px">
              <div class="order-contnet detail-title">服务创盈</div>
              <div class="order-contnet detail-value">{{workOrderDetail.serviceProperty}}</div>
            </div>
          </div>
          
          <el-table
            :data="workOrderDetail.emWorkOrderVoList"
            border
            style="width: 100%;"
            :header-cell-style="{background:'#f7f7f7'}">
            <el-table-column prop="workOrderNumber" label="工单编号">
              <template slot-scope="scope">
                <el-link type="primary" @click="toWorkOrderDetail(scope.row)">{{scope.row.workOrderNumber}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="serviceName" label="服务项"></el-table-column>
            <el-table-column prop="serviceGradeName" label="工单服务级别"></el-table-column>
          </el-table>

        </div>

        <!-- 执行团队成员 -->
        <div class="right-card-content">
          <div class="file-header">
            <div class="title-content flex-w"><div class="line"></div>执行团队成员<div style="color:#dd0000">*</div></div>
          </div>
          <div>
            <el-input size="small" type="textarea" v-model="executor" clearable maxlength="300" show-word-limit :rows="4" placeholder="请输入"></el-input>
          </div>
        </div>

        <!-- 备注 -->
        <div class="right-card-content">
          <div class="file-header">
            <div class="title-content flex-w"><div class="line"></div>备注</div>
          </div>
          <div>
            <el-input size="small" type="textarea" v-model="remark" clearable maxlength="500" show-word-limit :rows="6" placeholder="请输入"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 查看图片 -->
  <el-image-viewer  v-if="showImgPreview" :on-close="closeViewer" :url-list="[viewUrl]" />
</div>
</template>

<script>
import OSSClient from "../../utils/ossClient";
const oss_client = new OSSClient();
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import list from '../configure/applyMixins/list';
export default {
  components: { ElImageViewer },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 120}px`,
      titleList:[],
      activityForm:{
        activityId:''
      },
      activityDescList:[],
      activityRules:{
        activityId:[
          {required: true, message: '请选择活动标题', trigger: 'change'}
        ]
      },
      executor:'',
      remark:'',
      createHeadInfo:{},
      attachmentFileList:[],
      workOrderDetail:{},
      viewUrl:'',
      showImgPreview:false,
      pageType:'',
      headInfo:{},
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      fromPageType:''
    };
  },
  created(){
    this.fromPageType = this.$route.query.fromPageType
    if(this.$route.query.createType=='edit'){//编辑
      this.pageType = 'edit'
      this.editCaseDetail(this.$route.query.caseId)
    }else{
      this.pageType = 'add'
      this.createHeadInfo = this.$route.query
      this.getOrderDetail()
    }
    // 获取活动标题下拉
    this.getActivityList()
    this.$nextTick(() => {
        this.$refs["activityRef"].clearValidate()
    })
  },
  methods: {
    // 编辑获取详情
    editCaseDetail(caseId){
      const params = {
        id:caseId
      }
      if(this.fromPageType=='service' && this.pageType == 'edit'){
        params.type = 1
      }
      this.requestMethodGet('/emEcReport/queryById',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          // 头部信息
          this.headInfo = data
          // 左侧附件
          let fileList = []
         if(data.emEcReportFiles){
          data.emEcReportFiles.forEach(it=>{
            let obj = {}
            obj.fileName = it.attachmentUrl.split("/")[it.attachmentUrl.split("/").length - 1];
            obj.filePath = it.attachmentUrl
            obj.uid = _.uniqueId('file_')
            fileList.push(obj)
          })
          this.attachmentFileList = fileList
         }
        //  活动
        if(data.emEcActivities){
          let list = []
          data.emEcActivities.forEach(it=>{
            list.push(it.id)
          })
          this.activityForm.activityId = list
          this.activityTitleChange()
        }
        // 工单明细
        this.workOrderDetail = data.emEcReportRelVo
        // 团队成员
        this.executor = data.executor
        // 备注
        this.remark = data.remark
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    getActivityList(){
      this.requestMethodGet('/emEcActivity/getSelect',{}).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data || []
          if(data.length){
            data.forEach(it=>{
              it.label = it.activityName
              it.value = it.id
            })
          }
          this.titleList = data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    getOrderDetail(){
      let params = {}
      if(this.fromPageType=='service'){
        params.type = 2
        params.queryId = this.createHeadInfo.serviceOrderId
      }else if(this.fromPageType=='workOrder'){
        params.type = 1
        params.queryId = this.createHeadInfo.serviceOrderId
      }
      this.requestMethodGet('/emEcReport/getApplyWork',params).then(res=>{
        if(res.data.code == 1000){
          this.workOrderDetail = res.data.data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    toServiceApplyDetail(){
      let routeUrl = this.$router.resolve({
        path: '/ServiceApplyList/ServiceApplyDetail',
        query: {
          id: this.workOrderDetail.id
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    toWorkOrderDetail(row){
      let routeUrl
      if (row.serviceType == 1) {
        routeUrl = this.$router.resolve({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 9 || row.serviceType == 10 || row.serviceType == 11) {
        routeUrl = this.$router.resolve({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 2) {
        routeUrl = this.$router.resolve({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
      window.open(routeUrl.href, '_blank')
    },
    activityTitleChange(){
      let descList = []
      this.titleList.forEach(it=>{
        let obj = {}
        if(this.activityForm.activityId.includes(it.id)){
          obj.title = it.label
          obj.desc = it.activityDesc
          descList.push(obj)
        }
      })
      console.log('descList',descList)
      this.activityDescList = descList
    },
    async handleUploadFile(file){
      if(this.attachmentFileList.length && this.attachmentFileList.length>9){
        this.$message({
          type:'warning',
          message:'最多上传十个附件'
        })
        return
      }
      const fileType = file.name.split('.')[1]
      const defaultType = ['pdf','xls','xlsx','doc','docx','png','jpg']
      const typeStr = defaultType.toString()
      if(!defaultType.includes(fileType.toLocaleLowerCase())){
        this.$message({
          type:'warning',
          message:`请上传${typeStr}格式文件`
        })
        return
      }else{
        await oss_client.getOSSClientInstance();
        const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name);
        let obj = {}
        obj.fileName = file.name
        obj.filePath = uploadFileRes.name
        obj.uid = _.uniqueId('file_')
        this.attachmentFileList.push(obj)
        console.log('uploadFileRes',uploadFileRes)
      }
    },
    closeViewer(){
      this.showImgPreview = false
    },
    viewFile(item){
      const fileType = item.fileName.split('.')[1].toLowerCase()
      const defaultViewType = ['png','jpg']
      if(defaultViewType.includes(fileType)){
        this.requestMethodGet("/web/file/getFullUrl", {url: encodeURI(item.filePath)}).then(res => {
          if (res.data.code == 1000) {
           this.viewUrl = res.data.data
           this.showImgPreview = true
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      }else if(fileType=='pdf'){
        this.requestMethodGet("/web/file/getFullUrl", {url: encodeURI(item.filePath)}).then(res => {
          if (res.data.code == 1000) {
           window.open(res.data.data);
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      }else{
        const params = {
          url: item.filePath
        };
        this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
          if (res.data.code == 1000) {
            window.location.href = res.data.data;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      }
    },
    deleteFile(item){
      this.attachmentFileList.forEach((it,index)=>{
        if(it.uid == item.uid){
          this.attachmentFileList.splice(index,1)
        }
      })
    },
    // 取消
    cancelCreate(){
      this.$confirm('确认退出新建案例？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
                  
      });
    },
    // 保存草稿
    saveDraft(){
      const params = this.handleSaveParams('draft')
      let url = this.pageType == 'add' ? '/emEcReport/add' : '/emEcReport/edit'
      this.requestMethodPost(url,params).then(res=>{
        if(res.data.code == 1000){
          this.$message.success('保存草稿成功！')
          this.$router.push({
            path:'/distributorCaseIndex/caseDetail',
            query:{
              caseId:res.data.data.id,
              fromPage:'create'
            }
          })
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 提交
    submitCase(formName){
       // 校验执行团队成员必填
      if(!this.executor){
        this.$message({
          type:'warning',
          message:'请输入执行团队成员'
        })
        return
      }
      this.$confirm('确认提交案例？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.handleSaveParams('submit')
            let url = this.pageType == 'add' ? '/emEcReport/add' : '/emEcReport/edit'
            this.requestMethodPost(url,params).then(res=>{
              if(res.data.code == 1000){
                this.$message.success('提交成功！')
                this.$router.push({
                  path:'/distributorCaseIndex'
                })
              }else{
                this.$message({
                    message: res.data.msg,
                    type: "error"
                });
              }
            })
          } else {
            return false;
          }
        });
      }).catch(() => {
      });
    },
    handleSaveParams(type){
      let list = []
      if(this.workOrderDetail.emWorkOrderVoList && this.workOrderDetail.emWorkOrderVoList.length){
        this.workOrderDetail.emWorkOrderVoList.forEach(it=>{
          let workOrderListObj = {}
          workOrderListObj.relatedType = 2
          workOrderListObj.relatedId = it.id
          list.push(workOrderListObj)
        })
      }
      let serviceApplyObj = {
        relatedType:1,
        relatedId:this.workOrderDetail.id
      }
      list.push(serviceApplyObj)
      let fileList = []
      this.attachmentFileList.forEach(it=>{
        fileList.push(it.filePath)
      })
      const params = {
        accountId:this.pageType == 'add' ? this.createHeadInfo.companyId : this.headInfo.accountId,
        activityId:this.activityForm.activityId,
        executor:this.executor,
        remark:this.remark,
        // 1.已提报 2.待提报 3.提报被驳回
        reportStatus:type=='draft' ? 2 : 1,
        spId:this.pageType == 'add' ? this.createHeadInfo.distributorCompanyId : this.headInfo.spId,
        emEcReportRels:list,
        files:fileList
      }
      if(this.fromPageType=='workOrder'){
        params.fromType = 2
      }else if(this.fromPageType=='service'){
        params.fromType = 1
      }else{
        params.fromType = this.headInfo.fromType
      }
      if(this.pageType == 'edit'){
        params.id = this.headInfo.id
      }
      return params
    },
  }
};
</script>
<style lang='less' scoped>
.case-create-content{
  height: 100%;
  position:relative;
  overflow: auto;
}
.top-btn-content{
  position: absolute; 
  right: 20px; 
  height: 55px; 
  line-height: 55px; 
  top: -55px; 
  color: red; 
  cursor: pointer; 
  display: flex; 
  align-items: center
}
  .create-header{
    padding: 16px 20px;
    background: #fff;
    border-radius: 6px;
    margin: 20px 0;
  }
  .status{
    width: 60px;
    height: 28px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #001450;
    color: #fff;
    font-size: 12px;
  }
  .create-content{
    
    display: flex;
    // align-items: center;
  }
  .left-content{
    width: 288px;
    background-color: #fff;
    padding: 13px 20px 20px 20px;
    border-radius:8px
  }
  .file-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .line{
    width: 3px;
    height: 14px;
    background-color: #dd0000;
    margin-right: 10px;
  }
  .title-content{
    font-size: 14px;
    font-weight: bold;
    line-height: 14px;
  }
  .flex-w{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex-h{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .upload-btn{
    width: 80px;
    height: 28px;
    background-color: #dd0000;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
  }
  .file-content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 25px;
    margin-top: 10px;
  }
  .right-content{
    margin-left: 20px;
    -webkit-box-flex: 1;
  }
  .right-card-content{
    background-color: #fff;
    border-radius: 6px;
    padding: 20px;
    margin-top: 20px;
  }
  .order-contnet{
    font-size: 13px;
  }
  .detail-title{
    color: #999;
    margin-right:16px;
  }
  .detail-value{
    color: #333;
  }
</style>
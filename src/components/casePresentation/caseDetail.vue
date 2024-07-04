<template>
<div style="position:relative;background: #f2f3f6;">
  <div class="top-btn-content">
    <!-- 需要加按钮权限控制 -->
    <el-button plain size="small" @click="back">返回</el-button>
    <!-- v-auth="{ 
        menuCodes:'Excellentcase_Delete', 
        strategyNames:['personal'],
        strategySource:{
          personal:detail.commitUserId
        }
      }" -->
    <el-button plain size="small"
     @click="deleteCase"
      v-has="Excellentcase_Delete"
      v-if="detail.reportStatus==2 && detail.caseNo && userInfo.userId == detail.commitUserId">删除</el-button>
      <!-- v-auth="{ 
        menuCodes:'Excellentcase_Withdraw', 
        strategyNames:['personal'],
        strategySource:{
          personal:detail.commitUserId
        }
      }" -->
    <el-button type="danger"
     size="small" 
     @click="revocationCase" 
      v-if="detail.reportStatus==1 && userInfo.userId == detail.commitUserId && detail.checkStatus==1 && userInfo.userType==1" 
      v-has="Excellentcase_Withdraw"
     >撤回</el-button>
    <el-button type="danger" plain size="small" @click="reject" v-show="detail.reportStatus==1 && detail.checkStatus == 1 && !isAdmin" v-has="Excellentcase_Turndown">驳回</el-button>
    <el-button type="danger" size="small" @click="reviewedAndPush" v-show="detail.reportStatus==1 && detail.checkStatus==1 && !isAdmin" v-has="Excellentcase_Electionread">已审阅并推选</el-button>
    <el-button type="danger" size="small" @click="reviewed" v-show="detail.reportStatus==1 && detail.checkStatus==1 && !isAdmin" v-has="Excellentcase_Read">已审阅</el-button>
    <!-- v-auth="{ 
        menuCodes:'Excellentcase_Editor', 
        strategyNames:['personal'],
        strategySource:{
          personal:detail.commitUserId
        }
      }" -->
    <el-button type="danger"
     size="small" 
     @click="editCase" 
     v-if="detail.reportStatus==2 && userInfo.userId == detail.commitUserId"
     v-has="Excellentcase_Editor"
     >编辑</el-button>
  </div>
  <div class="case-create-content" :style="mainminheight">
    <!-- 右侧图标 -->
    <img src="../../assets/case_elected.png" class="case_icon" v-show="userInfo.userType==0 && detail.checkStatus==2">
    <img src="../../assets/case_rejected.png" class="case_icon" v-show="userInfo.userType==0 && detail.checkStatus==4">
    <img src="../../assets/case_reviewed.png" class="case_icon" v-show="userInfo.userType==0 && detail.checkStatus==3">
    <!-- 头部信息 -->
    <div class="create-header">
      <div class="status" v-show="detail.reportStatus==2">待提报</div>
      <div class="has-apply" v-show="detail.reportStatus==1">已提报</div>
      <div class="has-reject" v-show="detail.reportStatus==3">提报被驳回</div>
      <el-form :model="createForm" label-position="top" label-width="120px" inline>
        <el-row>
          <el-col :span="3">
            <el-form-item label="案例编号">
              <div>{{detail.caseNo}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="服务商">
              <div>{{detail.spName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户名称">
              <div>{{detail.accountName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="提报人">
              <div>{{detail.userName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="提报时间">
              <div>{{detail.commitTime}}</div>
            </el-form-item>
          </el-col>
          <div v-show="detail.checkStatus>1">
            <el-col :span="3">
              <el-form-item :label="detail.checkStatus==2?'推选人':detail.checkStatus==3?'审阅人':detail.checkStatus==4?'驳回人':''">
                <div>{{detail.reviewUserName}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="detail.checkStatus==2?'推选时间':detail.checkStatus==3?'审阅时间':detail.checkStatus==4?'驳回时间':''">
                <div>{{detail.reviewTime}}</div>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-row v-show="detail.checkStatus==2 || detail.checkStatus==4">
          <el-col :span="24">
            <el-form-item :label="detail.checkStatus==2?'推选原因':detail.checkStatus==4?'驳回原因':''">
              <div>{{detail.reviewEvaluate}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="create-content" style="display: -webkit-box;">
      <!-- 左侧附件 -->
      <div class="left-content">
        <div class="file-header">
          <div class="title-content flex-w"><div class="line"></div>支持性材料</div>
        </div>
        <!-- 文件列表 -->
        <div style="display: flex;align-items: center;flex-direction: column;" v-show="detail.emEcReportFiles.length==0">
          <img src="../../assets/empty_file.png" style="width:160px;height:160px">
          <div style="font-size:13px;color:#999">暂无附件</div>
        </div>
        <div v-show="detail.emEcReportFiles.length>0">
          <div class="file-content"  v-for="(item,index) in detail.emEcReportFiles">
            <div class="flex-w">
              <img src="../../assets/case_create_file.png"  style="width:14px;height:14px">
              <div style="margin-left:8px;color:#666666;width: 180px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.fileName}}</div>
            </div>
            <div class="flex-w" style="font-size:13px">
              <el-link :underline="false" style="color:#001450" @click="viewFile(item)">查看</el-link>
            </div>
          </div>
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
            <el-form-item label="活动标题" prop="title">
              <span>{{activityForm.title}}</span>
            </el-form-item>
            <el-form-item label="活动简介">
              <div v-show="!detail.emEcActivities.length">-</div>
              <div v-show="detail.emEcActivities.length">
                <div v-for="it in activityDescList">
                  <div>{{it.activityName}}：</div>
                  <div>{{it.activityDesc}}</div>
                </div>
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
              <el-link type="primary" @click="toServiceApplyDetail">{{detail.emEcReportRelVo.serviceApplyNo}}</el-link>
            </div>
            <div class="flex-w"  style="margin-left:48px">
              <div class="order-contnet detail-title">服务创盈</div>
              <div class="order-contnet detail-value">{{detail.emEcReportRelVo.serviceProperty}}</div>
            </div>
            <div class="flex-w"  style="margin-left:48px" v-if="userInfo.userType==0">
              <div class="order-contnet detail-title">服务得分</div>
              <div class="order-contnet detail-value">{{detail.emEcReportRelVo.serviceGradeMark}}</div>
            </div>
          </div>
          
          <el-table
            :data="detail.emEcReportRelVo.emWorkOrderVoList"
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
            <el-table-column prop="score" label="服务得分" v-if="userInfo.userType==0"></el-table-column>
          </el-table>

        </div>

        <!-- 执行团队成员 -->
        <div class="right-card-content">
          <div class="file-header">
            <div class="title-content flex-w"><div class="line"></div>执行团队成员<div style="color:#dd0000">*</div></div>
          </div>
          <div>{{detail.executor}}</div>
        </div>

        <!-- 备注 -->
        <div class="right-card-content">
          <div class="file-header">
            <div class="title-content flex-w"><div class="line"></div>备注</div>
          </div>
          <div>{{detail.remark}}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- 驳回 -->
  <el-dialog
    title="请填写驳回原因"
    :visible.sync="rejectDialog"
    width="30%"
    :close-on-click-modal="false" 
    :close-on-press-escape="false">
    <el-form :model="rejectForm" :rules="rejectRules" ref="rejectRef">
      <el-form-item label="驳回原因" prop="rejectReason">
        <el-input v-model="rejectForm.rejectReason" size="small" clearable maxlength="150" show-word-limit type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" plain size="small" @click="cancelReject('rejectRef')">取 消</el-button>
      <el-button size="small" type="danger" @click="cofirmReject('rejectRef')">确 认</el-button>
    </span>
  </el-dialog>
  <!-- 审阅并推选 -->
  <el-dialog
    title="请填写推选理由"
    :visible.sync="pushDialog"
    width="30%"
    :close-on-click-modal="false" 
    :close-on-press-escape="false">
    <el-form :model="pushForm" :rules="pushRules" ref="pushRef">
      <el-form-item label="推选理由" prop="pushReason">
        <el-input v-model="pushForm.pushReason" size="small" clearable maxlength="150" show-word-limit type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" plain size="small" @click="cancelPush('pushRef')">取 消</el-button>
      <el-button size="small" type="danger" @click="cofirmPush('pushRef')">确 认</el-button>
    </span>
  </el-dialog>
  <!-- 查看图片 -->
  <el-image-viewer  v-show="showImgPreview" :on-close="closeViewer" :url-list="[viewUrl]" />
  
<el-dialog
  title="提示"
  :visible.sync="revocationCaseDialog"
  width="25%"
  :close-on-click-modal="false" 
  :close-on-press-escape="false">
  <span>确认撤回示范案例？</span>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" type="danger" plain @click="canncelRevocationCaseDialog">取 消</el-button>
    <el-button size="small" type="danger" @click="confirmRevocation">确认撤回</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: { ElImageViewer },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 120}px`,
      rejectDialog:false,
      rejectForm:{
        rejectReason:''
      },
      rejectRules:{
        rejectReason:[
          {required: true, message: '请填写驳回原因', trigger: 'blur'}
        ]
      },
      activityForm:{
        title:''
      },
      pushDialog:false,
      pushForm:{
        pushReason:''
      },
      pushRules:{
        pushReason:[
          {required: true, message: '请填写推选理由', trigger: 'blur'}
        ]
      },
      caseId:'',
      detail:{
        emEcActivities:[],
        emEcReportFiles:[],
        emEcReportRelVo:[]
      },
      activityDescList:[],
      showImgPreview:false,
      caseUserType:'',
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      revocationCaseDialog:false,
      isAdmin:false,
      fromPage:''
    };
  },
  created(){
    console.log('userInfo',this.userInfo)
    this.isAdmin = this.userInfo.accessTemplates.some(accessTemplate => accessTemplate.accessTemplateCode == "admin")
    this.fromPage = this.$route.query.fromPage ? this.$route.query.fromPage : ''
    this.caseUserType = this.$route.query.type
    this.caseId = this.$route.query.caseId
    this.getCaseDetail()
  },
  methods: {
    back(){
      if(this.fromPage){
        this.$router.push({
          path:'/distributorCaseIndex'
        })
      }else{
        this.$router.go(-1)
      }
    },
    getCaseDetail(){
      this.detail.emEcReportFiles = []
      this.requestMethodGet('/emEcReport/queryById',{id:this.caseId}).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          let title = []
          data.emEcActivities.forEach(it=>{
            title.push(it.activityName)
          })
          if(data.emEcReportFiles.length){
            data.emEcReportFiles.forEach(it=>{
              it.fileName = it.attachmentUrl.split("/")[it.attachmentUrl.split("/").length - 1];
            })
          }
          this.activityForm.title = title.join(',')
          this.activityDescList = data.emEcActivities
          this.detail = data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 申请单号跳转详情
    toServiceApplyDetail(){
      let routeUrl = this.$router.resolve({
        path: '/ServiceApplyList/ServiceApplyDetail',
        query: {
          id: this.detail.emEcReportRelVo.id
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    // 跳转工单详情
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
    // 编辑
    editCase(){
      this.$router.push({
        path:'/distributorCaseIndex/Create',
        query:{
          caseId:this.caseId,
          createType:'edit',
          fromPageType: "detail"
        }
      })
    },
     closeViewer(){
      this.showImgPreview = false
    },
    viewFile(item){
      const fileType = item.attachmentUrl.split('.')[1].toLowerCase()
      const defaultViewType = ['png','jpg']
      if(defaultViewType.includes(fileType)){
        this.requestMethodGet("/web/file/getFullUrl", {url: encodeURI(item.attachmentUrl)}).then(res => {
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
        this.requestMethodGet("/web/file/getFullUrl", {url: encodeURI(item.attachmentUrl)}).then(res => {
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
          url: item.attachmentUrl
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
    deleteCase(){
      this.$confirm('确认删除案例？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // 执行删除
        this.requestMethodGet('/emEcReport/deleteById',{id:this.caseId}).then(res=>{
          if(res.data.code == 1000){
            this.$message.success('删除成功')
            this.$router.go(-1)
          }else{
            this.$message({
                message: res.data.msg,
                type: "error"
            });
          }
        })
      }).catch(() => {
                  
      });
    },
    // 撤回
    revocationCase(){
      this.revocationCaseDialog = true
    },
    canncelRevocationCaseDialog(){
      this.revocationCaseDialog = false
    },
    confirmRevocation(){
      const params = {
        id:this.caseId,
        reportStatus:2
      }
      this.requestMethodPost('/emEcReport/updateStatus',params).then(res=>{
          if(res.data.code == 1000){
            this.revocationCaseDialog = false
            this.$message.success('撤回成功')
            this.getCaseDetail()
          }else{
            this.$message({
                message: res.data.msg,
                type: "error"
            });
          }
        })
    },
    // 驳回
    reject(){
      this.rejectDialog = true;
    },
    cancelReject(formName){
      this.$refs[formName].resetFields();
      this.rejectDialog = false;
      this.rejectForm.rejectReason = ''
    },
    cofirmReject(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
        const params = {
          id:this.caseId,
          checkStatus:4,
          reportStatus:3,
          reviewEvaluate:this.rejectForm.rejectReason
        }
        this.requestMethodPost('/emEcReport/updateStatus',params).then(res=>{
          if(res.data.code == 1000){
            this.cancelReject(formName)
            this.$router.push({
                path:'/areaManagerIndex',
                query:{
                  tabsType:'has'
                }
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
    },
    // 审阅并推送
    reviewedAndPush(){
      this.pushDialog = true
    },
    cancelPush(formName){
      this.$refs[formName].resetFields();
      this.pushDialog = false;
      this.pushForm.pushReason = ''
    },
    cofirmPush(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id:this.caseId,
            checkStatus:2,
            reportStatus:1,
            reviewEvaluate:this.pushForm.pushReason
          }
          this.requestMethodPost('/emEcReport/updateStatus',params).then(res=>{
            if(res.data.code == 1000){
              this.cancelPush(formName)
              this.$router.push({
                path:'/areaManagerIndex',
                query:{
                  tabsType:'has'
                }
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
    },
    // 已审阅
    reviewed(){
      this.$confirm('确认已审阅该案例？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
            id:this.caseId,
            checkStatus:3,
            reportStatus:1
          }
          this.requestMethodPost('/emEcReport/updateStatus',params).then(res=>{
            if(res.data.code == 1000){
              this.$router.push({
                path:'/areaManagerIndex',
                query:{
                  tabsType:'has'
                }
              })
            }else{
              this.$message({
                  message: res.data.msg,
                  type: "error"
              });
            }
          })
      }).catch(() => {
                  
      });
    },
    // onResize() {
    //   this.mainminheight = `height:${document.documentElement.clientHeight -
    //     236}px`;
    // }
  }
};
</script>
<style lang='less' scoped>
.case_icon{
  width: 90px;
  height: 90px;
  display: block;
  position: absolute;
  right: 20px;
  top: 20px;
}
.has-apply{
  width: 60px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #008888;
  color: #fff;
  font-size: 12px;
}
.has-reject{
  width: 84px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dd0000;
  color: #fff;
  font-size: 12px;
}
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